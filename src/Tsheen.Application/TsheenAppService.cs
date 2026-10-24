using Tsheen.Localization;
using Volo.Abp.Application.Services;

namespace Tsheen;

/* Inherit your application services from this class.
 */
public abstract class TsheenAppService : ApplicationService
{
    protected TsheenAppService()
    {
        LocalizationResource = typeof(TsheenResource);
    }
}
