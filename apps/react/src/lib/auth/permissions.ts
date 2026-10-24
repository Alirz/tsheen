import { createAbpReactAppConfig } from '@volo/abp-react-app-config'
import { getApiUrl } from '@/lib/runtime-config'

export const appConfig = createAbpReactAppConfig({
  baseUrl: () => getApiUrl(),
  includeLocalizationResources: false,
})
