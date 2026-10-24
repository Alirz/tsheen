import { createAbpOidcAuth, type AbpOidcAuthClient } from '@volo/abp-oidc-auth'
import { createAbpReactOidcAuth, type AbpReactOidcAuthClient } from '@volo/abp-react-oidc-auth'
import { getOAuthConfig } from '@/lib/runtime-config'

let authClient: AbpReactOidcAuthClient | null = null

export function initUserManager(): AbpReactOidcAuthClient {
  const config = getOAuthConfig()
  const oidc = createAbpOidcAuth({
    authority: config.issuer,
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    postLogoutRedirectUri: config.redirectUri,
    silentRedirectUri: `${config.redirectUri}/silent-renew.html`,
    responseType: config.responseType,
    scope: config.scope,
    automaticSilentRenew: true,
    userStoreType: 'localStorage',
    userStorePrefix: `oidc.${config.clientId}`,
  })

  authClient = createAbpReactOidcAuth({ client: oidc })
  return authClient
}

export function getAuthClient(): AbpReactOidcAuthClient {
  if (!authClient) {
    return initUserManager()
  }

  return authClient
}

export function createSilentRenewClient(): AbpOidcAuthClient {
  const config = getOAuthConfig()
  return createAbpOidcAuth({
    authority: config.issuer,
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    postLogoutRedirectUri: config.redirectUri,
    silentRedirectUri: `${config.redirectUri}/silent-renew.html`,
    responseType: config.responseType,
    scope: config.scope,
    automaticSilentRenew: true,
    userStoreType: 'localStorage',
    userStorePrefix: `oidc.${config.clientId}`,
  })
}
