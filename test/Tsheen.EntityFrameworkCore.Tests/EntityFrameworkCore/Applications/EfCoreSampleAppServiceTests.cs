using Tsheen.Samples;
using Xunit;

namespace Tsheen.EntityFrameworkCore.Applications;

[Collection(TsheenTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<TsheenEntityFrameworkCoreTestModule>
{

}
