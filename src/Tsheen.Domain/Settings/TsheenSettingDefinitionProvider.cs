using Volo.Abp.Settings;

namespace Tsheen.Settings;

public class TsheenSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(TsheenSettings.MySetting1));
    }
}
