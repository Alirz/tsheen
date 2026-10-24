using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Data;
using Volo.Abp.Security.Claims;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Sqlite;
using Volo.Abp.FeatureManagement;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;

namespace Tsheen;

public sealed class TsheenLocalJwtHostFactory : IAsyncDisposable
{
    public const string ApiSelfUrl = TsheenAuthServerHostFactory.ApiSelfUrl;

    private readonly WebApplication _app;

    private TsheenLocalJwtHostFactory(WebApplication app)
    {
        _app = app;
    }

    public IServiceProvider Services => _app.Services;

    public static async Task<TsheenLocalJwtHostFactory> StartAsync(
        AbpUnitTestSqliteDatabase database,
        TsheenAuthServerHostFactory authServer)
    {
        var contentRoot = ContentRoot("Tsheen.HttpApi.Host");
        Directory.CreateDirectory(Path.Combine(contentRoot, "wwwroot"));

        var builder = WebApplication.CreateBuilder(new WebApplicationOptions
        {
            ApplicationName = typeof(TsheenHttpApiHostModule).Assembly.GetName().Name,
            ContentRootPath = contentRoot,
            EnvironmentName = Environments.Development,
        });

        builder.Host.UseAutofac();
        builder.WebHost.UseTestServer();
        builder.Configuration.AddInMemoryCollection(Settings(database));

        await builder.AddApplicationAsync<TsheenHttpApiHostModule>();

        builder.Services.Configure<AbpDbConnectionOptions>(options =>
        {
            options.ConnectionStrings.Default = database.ConnectionString;
        });

        builder.Services.Configure<AbpDbContextOptions>(options =>
        {
            options.Configure(context =>
            {
                context.UseSqlite();
            });
        });

        builder.Services.Configure<FeatureManagementOptions>(options =>
        {
            options.SaveStaticFeaturesToDatabase = false;
            options.IsDynamicFeatureStoreEnabled = false;
        });

        builder.Services.Configure<PermissionManagementOptions>(options =>
        {
            options.SaveStaticPermissionsToDatabase = false;
            options.IsDynamicPermissionStoreEnabled = false;
        });

        builder.Services.Configure<AbpBackgroundJobOptions>(options =>
        {
            options.IsJobExecutionEnabled = false;
        });

        builder.Services.AddAlwaysDisableUnitOfWorkTransaction();

        var signingKeys = await AuthServerSigningKeysAsync(authServer);
        builder.Services.PostConfigureAll<JwtBearerOptions>(options =>
        {
            var configuration = new OpenIdConnectConfiguration
            {
                Issuer = TsheenAuthServerHostFactory.Issuer + "/",
            };
            foreach (var key in signingKeys)
            {
                configuration.SigningKeys.Add(key);
            }

            options.Authority = TsheenAuthServerHostFactory.Issuer;
            options.Audience = TsheenAuthServerHostFactory.Audience;
            options.RequireHttpsMetadata = false;
            options.Events ??= new JwtBearerEvents();
            var previousTokenValidated = options.Events.OnTokenValidated;
            options.Events.OnTokenValidated = async context =>
            {
                if (previousTokenValidated != null)
                {
                    await previousTokenValidated(context);
                }

                // AuthServer's OpenIddict module rewrites the static AbpClaimTypes to short
                // names for this process. The API host, in its own process, still reads
                // ClaimTypes.NameIdentifier. Keep the validated subject under the claim type
                // CurrentUser uses here, without relaxing signature or audience checks.
                var identity = context.Principal?.Identities.FirstOrDefault();
                if (identity == null || identity.FindFirst(AbpClaimTypes.UserId) != null)
                {
                    return;
                }

                var subject = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? identity.FindFirst("sub")?.Value;
                if (!string.IsNullOrWhiteSpace(subject))
                {
                    identity.AddClaim(new Claim(AbpClaimTypes.UserId, subject));
                }
            };
            options.Configuration = configuration;
            options.ConfigurationManager = new StaticConfigurationManager<OpenIdConnectConfiguration>(configuration);
            options.TokenValidationParameters.ValidIssuers = new[]
            {
                TsheenAuthServerHostFactory.Issuer,
                TsheenAuthServerHostFactory.Issuer + "/",
            };
        });

        var app = builder.Build();
        await app.InitializeApplicationAsync();
        await app.StartAsync();
        return new TsheenLocalJwtHostFactory(app);
    }

    private static async Task<IList<SecurityKey>> AuthServerSigningKeysAsync(TsheenAuthServerHostFactory authServer)
    {
        using var client = authServer.CreateClient();
        using var response = await client.GetAsync("/.well-known/jwks");
        var body = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException("AuthServer JWKS request failed with status " + (int)response.StatusCode + ".");
        }

        var keys = new JsonWebKeySet(body).GetSigningKeys();
        if (keys.Count == 0)
        {
            throw new InvalidOperationException("AuthServer published no signing keys.");
        }

        return keys;
    }

    public HttpClient CreateClient()
    {
        return _app.GetTestServer().CreateClient();
    }

    public async ValueTask DisposeAsync()
    {
        await _app.DisposeAsync();
    }

    private static Dictionary<string, string?> Settings(AbpUnitTestSqliteDatabase database)
    {
        return new Dictionary<string, string?>
        {
            ["ConnectionStrings:Default"] = database.ConnectionString,
            ["AuthServer:Authority"] = TsheenAuthServerHostFactory.Issuer,
            ["AuthServer:RequireHttpsMetadata"] = "false",
            ["AuthServer:SwaggerClientId"] = TsheenAuthServerHostFactory.SwaggerClientId,
            ["App:SelfUrl"] = ApiSelfUrl,
            ["App:CorsOrigins"] = TsheenAuthServerHostFactory.AppRootUrl,
            ["App:RedirectAllowedUrls"] = TsheenAuthServerHostFactory.AppRootUrl,
            ["App:DisablePII"] = "true",
        };
    }

    private static string ContentRoot(string projectFolder)
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory != null)
        {
            var candidate = Path.Combine(directory.FullName, "src", projectFolder);
            if (File.Exists(Path.Combine(candidate, projectFolder + ".csproj")))
            {
                return candidate;
            }

            directory = directory.Parent;
        }

        throw new DirectoryNotFoundException(projectFolder);
    }
}
