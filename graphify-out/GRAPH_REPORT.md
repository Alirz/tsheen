# Graph Report - tsheen  (2026-10-26)

## Corpus Check
- 206 files · ~41,451 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 62 file(s) not represented in the graph (top: .mdc 15, .abppkg 14, (none) 11)

## Summary
- 1280 nodes · 2206 edges · 95 communities (61 shown, 34 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b359d1b0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- TsheenAuthServerModule
- react/package.json
- system
- Index.cshtml
- TsheenDomainModule.cs
- check.mjs
- TsheenHttpApiHostModule.cs
- dependencies
- runtime-config.ts
- ServiceConfigurationContext
- compilerOptions
- Tsheen.slnx
- Task: {feature-name}
- TsheenDomainSharedModule
- router.tsx
- compilerOptions
- Tsheen.HttpApi.Host.csproj
- Orchestration
- AbpModule
- HomePage.tsx
- Tsheen.HttpApi.Client.csproj
- Tsheen.Application.Contracts.csproj
- services
- ChangeIdentityPasswordPolicySettingDefinitionProvider.cs
- Tsheen.EntityFrameworkCore.csproj
- Tsheen.TestBase.csproj
- Tsheen.Domain.csproj
- Test Agent (Verification Stage)
- Tsheen
- TsheenDbMigrationService.cs
- Tsheen.Domain.Shared.csproj
- TsheenLocalJwtHostFactory.cs
- Fact
- IServiceCollection
- DbMigratorHostedService
- system
- TsheenDbContext
- About this solution
- Tsheen UI standard
- TsheenTestBase
- Tsheen
- .AuthServer_serves_account_login_and_issues_three_segment_jwt_for_audience_Tsheen
- Tsheen.AuthServer/package.json
- axios.ts
- .StartAsync
- Tsheen.HttpApi.csproj
- design.mjs
- ITsheenDbSchemaMigrator
- IndexModel
- Shared Task Memory (`tsheen`)
- ITransientDependency
- Manager Agent
- Tsheen Figma UI
- TsheenController.cs
- Tsheen.Application.csproj
- scripts
- TsheenBrandingProvider
- Backend Agent
- Frontend Agent
- tools.mjs
- Login.cshtml
- Index.cshtml.cs
- tsheen-figma-mcp/package.json
- Code Review Agent
- Security Agent
- Variants Agent
- zip.mjs
- vite-env.d.ts
- tsconfig.json
- .ConfigureServices
- chief.md
- Tsheen.AuthServer.csproj
- i18n.ts
- limits.mjs
- TsheenTestBaseModule
- tsheen-figma
- ClientDemoService
- Tsheen.HttpApi.Host.Tests.csproj
- FakeCurrentPrincipalAccessor
- nginx-entrypoint.sh
- TsheenPermissionDefinitionProvider
- TsheenDbMigrationService
- scrub-appsettings.py
- AuthServerLoginCultureTests

## God Nodes (most connected - your core abstractions)
1. `Tsheen` - 32 edges
2. `TsheenDbContext` - 29 edges
3. `cn()` - 27 edges
4. `compilerOptions` - 19 edges
5. `Volo.Abp.Identity` - 19 edges
6. `TsheenDbMigrationService` - 18 edges
7. `compilerOptions` - 17 edges
8. `Tsheen.EntityFrameworkCore` - 16 edges
9. `TsheenHttpApiHostModule` - 15 edges
10. `LocalOpenIddictJwtHostTests` - 15 edges

## Surprising Connections (you probably didn't know these)
- `TsheenSsoHostFixture` --calls--> `TsheenDbContext`  [INFERRED]
  test/Tsheen.HttpApi.Host.Tests/TsheenSsoHostFixture.cs → src/Tsheen.EntityFrameworkCore/EntityFrameworkCore/TsheenDbContext.cs
- `App()` --calls--> `AuthProvider()`  [EXTRACTED]
  apps/react/src/App.tsx → apps/react/src/lib/auth/AuthContext.tsx
- `AppLayout()` --calls--> `Button()`  [EXTRACTED]
  apps/react/src/components/layout/AppLayout.tsx → apps/react/src/components/ui/button.tsx
- `rootRoute` --calls--> `AppLayout()`  [EXTRACTED]
  apps/react/src/routes/router.tsx → apps/react/src/components/layout/AppLayout.tsx
- `Button()` --calls--> `cn()`  [EXTRACTED]
  apps/react/src/components/ui/button.tsx → apps/react/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (95 total, 34 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (26): Captcha(), GoldBar1(), GoldBar3(), GoldBar5(), IconButton(), InputIcon(), InputIconVariant, activeItem (+18 more)

### Community 2 - "react/package.json"
Cohesion: 0.09
Nodes (29): devDependencies, jsdom@^27.0.1, tailwindcss@^4.3.3, @tailwindcss/vite@^4.3.3, @testing-library/react@^16.3.0, @types/node@^26.6.5, @types/react@^19.2.2, @types/react-dom@^19.2.2 (+21 more)

### Community 4 - "Index.cshtml"
Cohesion: 0.15
Nodes (9): AccountResource, IndexModel, Microsoft.AspNetCore.Http.Extensions, Microsoft.AspNetCore.Mvc.Localization, TsheenResource, Volo.Abp.Account.Localization, Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Branding, Volo.Abp.AspNetCore.Mvc.UI.Theming (+1 more)

### Community 5 - "TsheenDomainModule.cs"
Cohesion: 0.18
Nodes (4): Tsheen.Localization, Tsheen.Permissions, TsheenPermissions, TsheenAppService

### Community 6 - "check.mjs"
Cohesion: 0.09
Nodes (17): child, corner, design, failures, forbiddenInputs, hasKey(), here, mcp (+9 more)

### Community 8 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, clsx@^2.1.1, @hookform/resolvers@^5.2.2, lucide-react@^0.554.0, oidc-client-ts@3.5.0, react-dom@^19.3.1, tailwind-merge@^3.4.0, @volo/abp-app-config@10.7.0 (+10 more)

### Community 9 - "runtime-config.ts"
Cohesion: 0.13
Nodes (19): @volo/abp-react-app-config@10.7.0, zod@^4.1.12, App(), env, createSilentRenewClient(), initUserManager(), createAbpOidcAuth, createAbpReactOidcAuth (+11 more)

### Community 11 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 12 - "Tsheen.slnx"
Cohesion: 0.16
Nodes (10): net10.0, Microsoft.NET.Test.Sdk (17.14.1), Microsoft.NET.Sdk, net10.0, Microsoft.NET.Test.Sdk (17.14.1), Microsoft.NET.Sdk, net10.0, Microsoft.NET.Test.Sdk (17.14.1) (+2 more)

### Community 13 - "Task: {feature-name}"
Cohesion: 0.10
Nodes (20): Clarifications resolved, Closeout, Decision log, Handoffs, Immutable constraints, Intent, Manager plan, Requirements (authoritative) (+12 more)

### Community 14 - "TsheenDomainSharedModule"
Cohesion: 0.13
Nodes (5): TsheenDtoExtensions, TsheenGlobalFeatureConfigurator, TsheenModuleExtensionConfigurator, TsheenEfCoreEntityExtensionMappings, TsheenEntityFrameworkCoreModule

### Community 15 - "router.tsx"
Cohesion: 0.16
Nodes (16): react@^19.3.1, @tanstack/react-router@^1.170.46, queryClient, AppLayout(), authGuard(), AuthProvider(), useAuth(), appRoute (+8 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+10 more)

### Community 17 - "Tsheen.HttpApi.Host.csproj"
Cohesion: 0.12
Nodes (16): AspNetCore.HealthChecks.UI (9.0.0), AspNetCore.HealthChecks.UI.Client (9.0.0), AspNetCore.HealthChecks.UI.InMemory.Storage (9.0.0), IdentityModel (7.0.0), KubernetesClient (18.0.5), Microsoft.EntityFrameworkCore.InMemory (10.0.11), Volo.Abp.AspNetCore.Authentication.JwtBearer (10.7.0), Volo.Abp.Swashbuckle (10.7.0) (+8 more)

### Community 18 - "Orchestration"
Cohesion: 0.11
Nodes (17): Escalation filter, Graphify preflight, Orchestration, Project Chief of Staff (`tsheen`), Recording handoffs, Repository, Retry and escalation, Run state (chief only) (+9 more)

### Community 19 - "AbpModule"
Cohesion: 0.15
Nodes (5): TsheenApplicationContractsModule, TsheenApplicationModule, TsheenDomainModule, TsheenHttpApiClientModule, TsheenConsoleApiClientModule

### Community 20 - "HomePage.tsx"
Cohesion: 0.14
Nodes (15): class-variance-authority@^0.7.1, @radix-ui/react-slot@^1.2.4, react-hook-form@^7.66.0, @tanstack/react-query@^5.104.5, Button(), ButtonProps, buttonVariants, AppHomePage() (+7 more)

### Community 21 - "Tsheen.HttpApi.Client.csproj"
Cohesion: 0.13
Nodes (13): Microsoft.Extensions.Http.Polly (10.0.11), Volo.Abp.Account.HttpApi.Client (10.7.0), Volo.Abp.FeatureManagement.HttpApi.Client (10.7.0), Volo.Abp.Http.Client.IdentityModel (10.7.0), Volo.Abp.Identity.HttpApi.Client (10.7.0), Volo.Abp.PermissionManagement.HttpApi.Client (10.7.0), Volo.Abp.SettingManagement.HttpApi.Client (10.7.0), net10.0 (+5 more)

### Community 22 - "Tsheen.Application.Contracts.csproj"
Cohesion: 0.13
Nodes (13): Volo.Abp.Account.Application.Contracts (10.7.0), Volo.Abp.FeatureManagement.Application.Contracts (10.7.0), Volo.Abp.Identity.Application.Contracts (10.7.0), Volo.Abp.PermissionManagement.Application.Contracts (10.7.0), Volo.Abp.SettingManagement.Application.Contracts (10.7.0), net10.0, Microsoft.NET.Sdk, net10.0 (+5 more)

### Community 23 - "services"
Cohesion: 0.08
Nodes (36): build, depends_on, environment, ports, context, dockerfile, migrator, API_URL (+28 more)

### Community 24 - "ChangeIdentityPasswordPolicySettingDefinitionProvider.cs"
Cohesion: 0.16
Nodes (5): Tsheen.Settings, Tsheen.Identity, ChangeIdentityPasswordPolicySettingDefinitionProvider, TsheenSettingDefinitionProvider, TsheenSettings

### Community 25 - "Tsheen.EntityFrameworkCore.csproj"
Cohesion: 0.14
Nodes (13): Microsoft.EntityFrameworkCore.Design (10.0.11), Microsoft.EntityFrameworkCore.Tools (10.0.11), Volo.Abp.AuditLogging.EntityFrameworkCore (10.7.0), Volo.Abp.BackgroundJobs.EntityFrameworkCore (10.7.0), Volo.Abp.BlobStoring.Database.EntityFrameworkCore (10.7.0), Volo.Abp.EntityFrameworkCore.SqlServer (10.7.0), Volo.Abp.FeatureManagement.EntityFrameworkCore (10.7.0), Volo.Abp.Identity.EntityFrameworkCore (10.7.0) (+5 more)

### Community 26 - "Tsheen.TestBase.csproj"
Cohesion: 0.14
Nodes (13): NSubstitute (5.3.0), NSubstitute.Analyzers.CSharp (1.0.17), Shouldly (4.3.0), Volo.Abp.Authorization (10.7.0), Volo.Abp.BackgroundJobs.Abstractions (10.7.0), Volo.Abp.TestBase (10.7.0), xunit (2.9.3), xunit.extensibility.execution (2.9.3) (+5 more)

### Community 27 - "Tsheen.Domain.csproj"
Cohesion: 0.14
Nodes (13): Volo.Abp.AuditLogging.Domain (10.7.0), Volo.Abp.BackgroundJobs.Domain (10.7.0), Volo.Abp.BlobStoring.Database.Domain (10.7.0), Volo.Abp.Caching (10.7.0), Volo.Abp.Emailing (10.7.0), Volo.Abp.FeatureManagement.Domain (10.7.0), Volo.Abp.Identity.Domain (10.7.0), Volo.Abp.OpenIddict.Domain (10.7.0) (+5 more)

### Community 28 - "Test Agent (Verification Stage)"
Cohesion: 0.15
Nodes (12): Allowed extension languages, Global skills (do not copy into the project), Standards, Step 0 — Load task context, Step 1 — Requirement checklist (before editing any file), Step 2 — Choose the strategy, Step 7 gate — pre-completion (mandatory), Step 9 — Return the verification handoff (+4 more)

### Community 29 - "Tsheen"
Cohesion: 0.08
Nodes (3): Tsheen.HttpApi.Client.ConsoleTestApp, TsheenApplicationTestModule, TsheenDomainTestModule

### Community 31 - "Tsheen.Domain.Shared.csproj"
Cohesion: 0.15
Nodes (12): Microsoft.Extensions.FileProviders.Embedded (10.0.11), Volo.Abp.AuditLogging.Domain.Shared (10.7.0), Volo.Abp.BackgroundJobs.Domain.Shared (10.7.0), Volo.Abp.BlobStoring.Database.Domain.Shared (10.7.0), Volo.Abp.FeatureManagement.Domain.Shared (10.7.0), Volo.Abp.GlobalFeatures (10.7.0), Volo.Abp.Identity.Domain.Shared (10.7.0), Volo.Abp.OpenIddict.Domain.Shared (10.7.0) (+4 more)

### Community 36 - "DbMigratorHostedService"
Cohesion: 0.13
Nodes (4): DbMigratorHostedService, Program, TsheenDbMigratorModule, TsheenDatabaseCheck

### Community 37 - "system"
Cohesion: 0.12
Nodes (7): Tsheen.Migrations, Tsheen.EntityFrameworkCore, Initial, TsheenEntityFrameworkCoreCollection, TsheenEntityFrameworkCoreCollectionFixtureBase, TsheenEntityFrameworkCoreFixture, TsheenSsoHostCollection

### Community 38 - "TsheenDbContext"
Cohesion: 0.05
Nodes (17): Tsheen.Models.Test, TsheenDbContext, ClaimTypes, LinkUsers, OrganizationUnits, Roles, SecurityLogs, Sessions (+9 more)

### Community 39 - "About this solution"
Cohesion: 0.18
Nodes (10): About this solution, Additional resources, Before running the application, Configurations, Deploying the application, Generating a Signing Certificate, Pre-requirements, Solution structure (+2 more)

### Community 40 - "Tsheen UI standard"
Cohesion: 0.25
Nodes (7): Canvases and sections, Checked values, Components, Fill styles, Tokens, Tsheen UI standard, Typography

### Community 42 - "Tsheen"
Cohesion: 0.12
Nodes (9): Tsheen.EntityFrameworkCore.Samples, Tsheen.EntityFrameworkCore.Domains, Tsheen.HttpApi.Host.Tests, Tsheen.Samples, Tsheen, TsheenDomainErrorCodes, TsheenConsts, TsheenTestConsts (+1 more)

### Community 44 - "Tsheen.AuthServer/package.json"
Cohesion: 0.25
Nodes (8): @abp/aspnetcore.mvc.ui.theme.leptonxlite, dependencies, @abp/aspnetcore.mvc.ui.theme.leptonxlite@~5.7.0, name, private, resolutions, jquery, version

### Community 45 - "axios.ts"
Cohesion: 0.19
Nodes (10): axios@^1.13.2, ApplicationConfigurationDto, configurationApi, CurrentUserDto, api, ensureAccessToken(), RetryConfig, getAccessToken (+2 more)

### Community 46 - ".StartAsync"
Cohesion: 0.06
Nodes (12): Tsheen.EntityFrameworkCore.Applications, SampleDomainTests, TsheenDomainTestBase, EfCoreSampleAppServiceTests, EfCoreSampleDomainTests, TsheenEntityFrameworkCoreTestModule, TsheenAuthServerHostFactory, TsheenLocalJwtHostFactory (+4 more)

### Community 47 - "Tsheen.HttpApi.csproj"
Cohesion: 0.25
Nodes (7): Volo.Abp.Account.HttpApi (10.7.0), Volo.Abp.FeatureManagement.HttpApi (10.7.0), Volo.Abp.Identity.HttpApi (10.7.0), Volo.Abp.PermissionManagement.HttpApi (10.7.0), Volo.Abp.SettingManagement.HttpApi (10.7.0), net10.0, Microsoft.NET.Sdk

### Community 48 - "design.mjs"
Cohesion: 0.23
Nodes (17): channelByte(), childrenByParent(), cssNamesOf(), designPath, guidOf(), hashToHex(), hexFromColor(), loadDesign() (+9 more)

### Community 49 - "ITsheenDbSchemaMigrator"
Cohesion: 0.38
Nodes (3): ITsheenDbSchemaMigrator, NullTsheenDbSchemaMigrator, EntityFrameworkCoreTsheenDbSchemaMigrator

### Community 50 - "IndexModel"
Cohesion: 0.14
Nodes (6): IndexModel, Applications, CurrentLanguage, LanguageProvider, Languages, OpenIdApplicationRepository

### Community 51 - "Shared Task Memory (`tsheen`)"
Cohesion: 0.29
Nodes (6): Command output, Context rules, Handoff contract, Ownership, Reading, Shared Task Memory (`tsheen`)

### Community 53 - "Manager Agent"
Cohesion: 0.33
Nodes (5): Contract, Manager Agent, Output to chief, Procedure, Repository

### Community 54 - "Tsheen Figma UI"
Cohesion: 0.33
Nodes (5): Examples, Instructions, Performance Notes, Troubleshooting, Tsheen Figma UI

### Community 56 - "Tsheen.Application.csproj"
Cohesion: 0.25
Nodes (7): Volo.Abp.Account.Application (10.7.0), Volo.Abp.FeatureManagement.Application (10.7.0), Volo.Abp.Identity.Application (10.7.0), Volo.Abp.PermissionManagement.Application (10.7.0), Volo.Abp.SettingManagement.Application (10.7.0), net10.0, Microsoft.NET.Sdk

### Community 57 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, test

### Community 58 - "TsheenBrandingProvider"
Cohesion: 0.22
Nodes (5): TsheenBrandingProvider, AppName, LogoIconUrl, LogoUrl, Volo.Abp.Ui.Branding

### Community 59 - "Backend Agent"
Cohesion: 0.40
Nodes (4): Backend Agent, Contract, Procedure, Repository

### Community 60 - "Frontend Agent"
Cohesion: 0.40
Nodes (4): Contract, Frontend Agent, Procedure, Repository

### Community 61 - "tools.mjs"
Cohesion: 0.18
Nodes (16): COMPONENT_CATALOG, DESIGN_FILE_NAME, allowedArguments, callTool(), componentNames, design(), matchesName(), nameFilter (+8 more)

### Community 62 - "Login.cshtml"
Cohesion: 0.33
Nodes (4): LoginModel, Microsoft.AspNetCore.Mvc.Localization, TsheenResource, Volo.Abp.Account.Web.Pages.Account

### Community 64 - "tsheen-figma-mcp/package.json"
Cohesion: 0.18
Nodes (11): kiwi-schema, dependencies, kiwi-schema@0.5.0, description, name, private, scripts, check (+3 more)

### Community 65 - "Code Review Agent"
Cohesion: 0.50
Nodes (3): Code Review Agent, Contract, Procedure

### Community 66 - "Security Agent"
Cohesion: 0.50
Nodes (3): Contract, Procedure, Security Agent

### Community 67 - "Variants Agent"
Cohesion: 0.50
Nodes (3): Contract, Procedure, Variants Agent

### Community 68 - "zip.mjs"
Cohesion: 0.38
Nodes (9): assertSafeZipName(), CANVAS_MAX_BYTES, isAllowedZipEntry(), findEocd(), inflateMember(), readDesignArchive(), readExact(), readMember() (+1 more)

### Community 72 - ".ConfigureServices"
Cohesion: 0.24
Nodes (3): TsheenResource, TsheenDomainSharedModule, TsheenHttpApiModule

### Community 77 - "Tsheen.AuthServer.csproj"
Cohesion: 0.17
Nodes (11): Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation (10.0.11), Volo.Abp.Account.Web.OpenIddict (10.7.0), Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite (5.7.0), net10.0, Serilog.AspNetCore (9.0.0), Serilog.Sinks.Async (2.1.0), Volo.Abp.AspNetCore.MultiTenancy (10.7.0), Volo.Abp.AspNetCore.Serilog (10.7.0) (+3 more)

### Community 80 - "i18n.ts"
Cohesion: 0.22
Nodes (6): i18next@^25.6.0, react-i18next@^16.2.4, @testing-library/jest-dom@^6.9.1, i18next, react-i18next, @testing-library/jest-dom

### Community 81 - "limits.mjs"
Cohesion: 0.21
Nodes (13): compileBoundedSchema(), decodeCanvas(), decodeMessage(), decodeSchema(), kiwiBoundedArray(), readChunks(), unreadByteCount(), ZSTD_MAGIC (+5 more)

### Community 85 - "ClientDemoService"
Cohesion: 0.20
Nodes (4): SampleAppServiceTests, TsheenApplicationTestBase, ClientDemoService, Program

### Community 87 - "Tsheen.HttpApi.Host.Tests.csproj"
Cohesion: 0.29
Nodes (6): Microsoft.AspNetCore.Authentication.JwtBearer (10.0.11), Microsoft.AspNetCore.Mvc.Testing (10.0.11), net10.0, Microsoft.NET.Test.Sdk (17.14.1), Volo.Abp.EntityFrameworkCore.Sqlite (10.7.0), Microsoft.NET.Sdk

## Knowledge Gaps
- **170 isolated node(s):** `node`, `net10.0`, `Volo.Abp.PermissionManagement.Application.Contracts (10.7.0)`, `Volo.Abp.FeatureManagement.Application.Contracts (10.7.0)`, `Volo.Abp.SettingManagement.Application.Contracts (10.7.0)` (+165 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 574 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Tsheen` connect `Tsheen` to `TsheenLocalJwtHostFactory.cs`, `system`, `TsheenDomainModule.cs`, `system`, `TsheenHttpApiHostModule.cs`, `TsheenDomainSharedModule`, `.StartAsync`, `ClientDemoService`, `TsheenBrandingProvider`, `Tsheen`, `TsheenDbMigrationService.cs`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `TsheenDbContext` (e.g. with `.ConfigureInMemorySqlite()` and `TsheenSsoHostFixture`) actually correct?**
  _`TsheenDbContext` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `node`, `net10.0`, `Volo.Abp.PermissionManagement.Application.Contracts (10.7.0)` to the rest of the system?**
  _170 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05909090909090909 - nodes in this community are weakly interconnected._
- **Why does `TsheenDbContext` connect `TsheenDbContext` to `TsheenEntityFrameworkCoreModule.cs`, `ITsheenDbSchemaMigrator`, `.StartAsync`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `react/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Why does `TsheenAuthServerModule` connect `TsheenAuthServerModule` to `TsheenHttpApiHostModule.cs`, `TsheenTestBaseModule`, `AbpModule`, `IHostEnvironment`, `.PreConfigureServices`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._