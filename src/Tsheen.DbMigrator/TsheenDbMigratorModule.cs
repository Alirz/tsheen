using Tsheen.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Tsheen.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(TsheenEntityFrameworkCoreModule),
    typeof(TsheenApplicationContractsModule)
)]
public class TsheenDbMigratorModule : AbpModule
{
}
