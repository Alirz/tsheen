extern alias AuthServer;

using System.Collections.Generic;
using System.Threading.Tasks;
using AuthServerProgram = AuthServer::Tsheen.Program;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Sqlite;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;

namespace Tsheen;

public sealed class TsheenAuthServerHostFactory : WebApplicationFactory<AuthServerProgram>
{
    public const string Issuer = "https://localhost:44366";
    public const string ApiSelfUrl = "https://localhost:44365";
    public const string AppRootUrl = "https://localhost:3000";
    public const string AppClientId = "Tsheen_App";
    public const string SwaggerClientId = "Tsheen_Swagger";
    public const string Audience = "Tsheen";

    private readonly AbpUnitTestSqliteDatabase _database;

    public TsheenAuthServerHostFactory(AbpUnitTestSqliteDatabase database)
    {
        _database = database;
    }

    public async Task SeedAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var seeder = scope.ServiceProvider.GetRequiredService<IDataSeeder>();
        await seeder.SeedAsync(
            new DataSeedContext()
                .WithProperty(
                    IdentityDataSeedContributor.AdminEmailPropertyName,
                    TsheenConsts.AdminEmailDefaultValue)
                .WithProperty(
                    IdentityDataSeedContributor.AdminPasswordPropertyName,
                    TsheenConsts.AdminPasswordDefaultValue));
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment(Environments.Development);
        ApplySettings(builder);
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(Settings());
        });

        builder.ConfigureTestServices(services =>
        {
            services.Configure<AbpDbConnectionOptions>(options =>
            {
                options.ConnectionStrings.Default = _database.ConnectionString;
            });

            services.Configure<AbpDbContextOptions>(options =>
            {
                options.Configure(context =>
                {
                    context.UseSqlite();
                });
            });

            services.Configure<FeatureManagementOptions>(options =>
            {
                options.SaveStaticFeaturesToDatabase = false;
                options.IsDynamicFeatureStoreEnabled = false;
            });

            services.Configure<PermissionManagementOptions>(options =>
            {
                options.SaveStaticPermissionsToDatabase = false;
                options.IsDynamicPermissionStoreEnabled = false;
            });

            services.Configure<AbpBackgroundJobOptions>(options =>
            {
                options.IsJobExecutionEnabled = false;
            });

            services.AddAlwaysDisableUnitOfWorkTransaction();
        });
    }

    private void ApplySettings(IWebHostBuilder builder)
    {
        foreach (var setting in Settings())
        {
            builder.UseSetting(setting.Key, setting.Value);
        }
    }

    private Dictionary<string, string?> Settings()
    {
        return new Dictionary<string, string?>
        {
            ["ConnectionStrings:Default"] = _database.ConnectionString,
            ["AuthServer:Authority"] = Issuer,
            ["AuthServer:RequireHttpsMetadata"] = "false",
            ["AuthServer:UseEphemeralEncryptionAndSigningKeys"] = "true",
            ["AuthServer:SwaggerClientId"] = SwaggerClientId,
            ["App:SelfUrl"] = Issuer,
            ["App:CorsOrigins"] = AppRootUrl,
            ["App:RedirectAllowedUrls"] = $"{AppRootUrl},{ApiSelfUrl}",
            ["App:DisablePII"] = "true",
            [$"OpenIddict:Applications:{AppClientId}:ClientId"] = AppClientId,
            [$"OpenIddict:Applications:{AppClientId}:RootUrl"] = AppRootUrl,
            [$"OpenIddict:Applications:{SwaggerClientId}:ClientId"] = SwaggerClientId,
            [$"OpenIddict:Applications:{SwaggerClientId}:RootUrl"] = ApiSelfUrl + "/",
        };
    }
}
