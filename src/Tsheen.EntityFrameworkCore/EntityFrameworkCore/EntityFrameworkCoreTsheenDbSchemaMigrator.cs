using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Tsheen.Data;
using Volo.Abp.DependencyInjection;

namespace Tsheen.EntityFrameworkCore;

public class EntityFrameworkCoreTsheenDbSchemaMigrator
    : ITsheenDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreTsheenDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the TsheenDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<TsheenDbContext>()
            .Database
            .MigrateAsync();
    }
}
