using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tsheen.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Sqlite;
using Xunit;

namespace Tsheen;

public sealed class TsheenSsoHostFixture : IAsyncLifetime
{
    private readonly AbpUnitTestSqliteDatabase _database = new();

    public TsheenAuthServerHostFactory AuthServer { get; }

    public TsheenLocalJwtHostFactory Api { get; private set; } = null!;

    public TsheenSsoHostFixture()
    {
        _database.CreateTables(
            new TsheenDbContext(
                new DbContextOptionsBuilder<TsheenDbContext>()
                    .UseSqlite(_database.ConnectionString)
                    .Options));

        AuthServer = new TsheenAuthServerHostFactory(_database);
    }

    public async Task InitializeAsync()
    {
        await AuthServer.SeedAsync();
        Api = await TsheenLocalJwtHostFactory.StartAsync(_database, AuthServer);
    }

    public async Task DisposeAsync()
    {
        if (Api != null)
        {
            await Api.DisposeAsync();
        }

        await AuthServer.DisposeAsync();
        _database.Dispose();
    }
}

[CollectionDefinition(Name)]
public sealed class TsheenSsoHostCollection : ICollectionFixture<TsheenSsoHostFixture>
{
    public const string Name = "Tsheen SSO hosts";
}
