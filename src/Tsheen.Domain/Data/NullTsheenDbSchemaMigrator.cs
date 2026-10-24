using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Tsheen.Data;

/* This is used if database provider does't define
 * ITsheenDbSchemaMigrator implementation.
 */
public class NullTsheenDbSchemaMigrator : ITsheenDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
