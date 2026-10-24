using Volo.Abp.Modularity;

namespace Tsheen;

[DependsOn(
    typeof(TsheenApplicationModule),
    typeof(TsheenDomainTestModule)
)]
public class TsheenApplicationTestModule : AbpModule
{

}
