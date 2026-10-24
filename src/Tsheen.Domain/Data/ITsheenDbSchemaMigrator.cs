using System.Threading.Tasks;

namespace Tsheen.Data;

public interface ITsheenDbSchemaMigrator
{
    Task MigrateAsync();
}
