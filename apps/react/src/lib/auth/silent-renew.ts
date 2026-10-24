import { loadRuntimeConfig } from '@/lib/runtime-config'
import { createSilentRenewClient } from '@/lib/auth/oidc'

async function renew() {
  await loadRuntimeConfig()
  const client = createSilentRenewClient()
  await client.getUserManager().signinSilentCallback()
}

void renew()
