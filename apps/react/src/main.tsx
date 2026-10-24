import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import { getAuthClient, initUserManager } from '@/lib/auth/oidc'
import { appConfig } from '@/lib/auth/permissions'
import { loadRuntimeConfig } from '@/lib/runtime-config'
import '@/lib/i18n/i18n'
import '@/index.css'

async function bootstrap() {
  await loadRuntimeConfig()
  initUserManager()
  const client = getAuthClient()
  await client.init()

  if (client.getSnapshot().isAuthenticated) {
    await appConfig.fetchConfig(await client.getAccessToken())
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
