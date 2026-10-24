using Volo.Abp.Modularity;

namespace Tsheen;

[DependsOn(
    typeof(TsheenDomainModule),
    typeof(TsheenTestBaseModule)
)]
public class TsheenDomainTestModule : AbpModule
{

}
