using Xunit;

namespace Tsheen.EntityFrameworkCore;

[CollectionDefinition(TsheenTestConsts.CollectionDefinitionName)]
public class TsheenEntityFrameworkCoreCollection : ICollectionFixture<TsheenEntityFrameworkCoreFixture>
{

}
