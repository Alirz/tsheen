using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.RequestLocalization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using OpenIddict.Server;
using OpenIddict.Validation.AspNetCore;
using OpenIddict.Server.AspNetCore;
using Tsheen.EntityFrameworkCore;
using Tsheen.MultiTenancy;
using Volo.Abp;
using Volo.Abp.Studio;
using Volo.Abp.Account.Web;
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite.Bundling;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.OpenIddict;
using Volo.Abp.Studio.Client.AspNetCore;
using Volo.Abp.Security.Claims;

namespace Tsheen;

[DependsOn(
    typeof(AbpStudioClientAspNetCoreModule),
    typeof(AbpAspNetCoreMvcUiLeptonXLiteThemeModule),
    typeof(AbpAutofacModule),
    typeof(AbpAspNetCoreMultiTenancyModule),
    typeof(TsheenApplicationModule),
    typeof(TsheenEntityFrameworkCoreModule),
    typeof(AbpAccountWebOpenIddictModule),
    typeof(AbpAspNetCoreSerilogModule)
    )]
public class TsheenAuthServerModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                options.AddAudiences("Tsheen");
                options.UseLocalServer();
                options.UseAspNetCore();
            });
        });

        PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
        {
            serverBuilder.DisableAccessTokenEncryption();
            serverBuilder.SetIssuer(new Uri(configuration["App:SelfUrl"]!));
        });

        // Absent or false keeps the development certificate, or the production pfx outside Development.
        // The environment variable is read directly because the test host sets it before CreateBuilder,
        // and that value is not always present on IConfiguration during PreConfigureServices.
        var useEphemeralKeys = configuration.GetValue<bool>("AuthServer:UseEphemeralEncryptionAndSigningKeys")
            || string.Equals(
                Environment.GetEnvironmentVariable("AuthServer__UseEphemeralEncryptionAndSigningKeys"),
                "true",
                StringComparison.OrdinalIgnoreCase);
        if (useEphemeralKeys)
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                serverBuilder.AddEphemeralEncryptionKey();
                serverBuilder.AddEphemeralSigningKey();
            });
        }
        else if (!hostingEnvironment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                serverBuilder.AddProductionEncryptionAndSigningCertificate("openiddict.pfx", configuration["AuthServer:CertificatePassPhrase"]!);
            });
        }
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();
        var hostingEnvironment = context.Services.GetHostingEnvironment();

        if (!configuration.GetValue<bool>("App:DisablePII"))
        {
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.LogCompleteSecurityArtifact = true;
        }

        if (!configuration.GetValue<bool>("AuthServer:RequireHttpsMetadata"))
        {
            Configure<OpenIddictServerAspNetCoreOptions>(options =>
            {
                options.DisableTransportSecurityRequirement = true;
            });

            Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedProto;
                options.KnownIPNetworks.Clear();
                options.KnownProxies.Clear();
            });
        }

        if (hostingEnvironment.IsDevelopment())
        {
            context.Services.AddRazorPages()
                .AddRazorRuntimeCompilation();
        }

        ConfigureStudio(hostingEnvironment);
        ConfigureAuthentication(context);
        ConfigureUrls(configuration);
        ConfigureBundles();
        ConfigureRequestLocalization();
        ConfigureVirtualFileSystem(context);
        ConfigureCors(context, configuration);
    }

    private void ConfigureRequestLocalization()
    {
        Configure<AbpRequestLocalizationOptions>(options =>
        {
            options.RequestLocalizationOptionConfigurators.Add((_, localizationOptions) =>
            {
                localizationOptions.DefaultRequestCulture = new RequestCulture("fa", "fa");
                foreach (var provider in localizationOptions.RequestCultureProviders
                             .OfType<AcceptLanguageHeaderRequestCultureProvider>()
                             .ToList())
                {
                    localizationOptions.RequestCultureProviders.Remove(provider);
                }

                return Task.CompletedTask;
            });
        });
    }

    private void ConfigureStudio(IHostEnvironment hostingEnvironment)
    {
        if (hostingEnvironment.IsProduction())
        {
            Configure<AbpStudioClientOptions>(options =>
            {
                options.IsLinkEnabled = false;
            });
        }
    }

    private void ConfigureAuthentication(ServiceConfigurationContext context)
    {
        context.Services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
    }

    private void ConfigureUrls(IConfiguration configuration)
    {
        Configure<AppUrlOptions>(options =>
        {
            options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
            options.RedirectAllowedUrls.AddRange(configuration["App:RedirectAllowedUrls"]?.Split(',') ?? Array.Empty<string>());
        });
    }

    private void ConfigureBundles()
    {
        Configure<AbpBundlingOptions>(options =>
        {
            options.StyleBundles.Configure(
                LeptonXLiteThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-styles.css");
                }
            );

            options.ScriptBundles.Configure(
                LeptonXLiteThemeBundles.Scripts.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-scripts.js");
                }
            );
        });
    }

    private void ConfigureVirtualFileSystem(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();

        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                ReplaceEmbeddedByPhysicalWhenPresent<TsheenDomainSharedModule>(options, hostingEnvironment, "Tsheen.Domain.Shared");
                ReplaceEmbeddedByPhysicalWhenPresent<TsheenDomainModule>(options, hostingEnvironment, "Tsheen.Domain");
                ReplaceEmbeddedByPhysicalWhenPresent<TsheenApplicationContractsModule>(options, hostingEnvironment, "Tsheen.Application.Contracts");
                ReplaceEmbeddedByPhysicalWhenPresent<TsheenApplicationModule>(options, hostingEnvironment, "Tsheen.Application");
            });
        }
    }

    private static void ReplaceEmbeddedByPhysicalWhenPresent<TModule>(
        AbpVirtualFileSystemOptions options,
        IHostEnvironment hostingEnvironment,
        string projectDirectory)
        where TModule : class
    {
        var path = Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}{projectDirectory}");
        if (Directory.Exists(path))
        {
            options.FileSets.ReplaceEmbeddedByPhysical<TModule>(path);
        }
    }

    private void ConfigureCors(ServiceConfigurationContext context, IConfiguration configuration)
    {
        context.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .WithOrigins(
                        configuration["App:CorsOrigins"]?
                            .Split(",", StringSplitOptions.RemoveEmptyEntries)
                            .Select(o => o.Trim().RemovePostFix("/"))
                            .ToArray() ?? Array.Empty<string>()
                    )
                    .WithAbpExposedHeaders()
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        app.UseForwardedHeaders();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseErrorPage();
        }

        app.UseRouting();
        app.MapAbpStaticAssets();
        app.UseAbpStudioLink();
        app.UseAbpSecurityHeaders();
        app.UseCors();
        app.UseAuthentication();
        app.UseAbpOpenIddictValidation();

        if (MultiTenancyConsts.IsEnabled)
        {
            app.UseMultiTenancy();
        }

        app.UseAbpExceptionHandling();
        app.UseDynamicClaims();
        app.UseAuthorization();

        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        app.UseConfiguredEndpoints();
    }
}
