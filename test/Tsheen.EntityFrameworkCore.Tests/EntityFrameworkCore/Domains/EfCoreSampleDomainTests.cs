using Tsheen.Samples;
using Xunit;

namespace Tsheen.EntityFrameworkCore.Domains;

[Collection(TsheenTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<TsheenEntityFrameworkCoreTestModule>
{

}
