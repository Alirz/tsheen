using Volo.Abp.Modularity;

namespace Tsheen;

public abstract class TsheenApplicationTestBase<TStartupModule> : TsheenTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
