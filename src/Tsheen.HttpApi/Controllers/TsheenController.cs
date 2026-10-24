using Tsheen.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Tsheen.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class TsheenController : AbpControllerBase
{
    protected TsheenController()
    {
        LocalizationResource = typeof(TsheenResource);
    }
}
