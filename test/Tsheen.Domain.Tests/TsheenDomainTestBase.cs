using Volo.Abp.Modularity;

namespace Tsheen;

/* Inherit from this class for your domain layer tests. */
public abstract class TsheenDomainTestBase<TStartupModule> : TsheenTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
