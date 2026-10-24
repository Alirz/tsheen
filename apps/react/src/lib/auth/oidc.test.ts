import { describe, expect, it, vi } from 'vitest'

const createAbpOidcAuth = vi.hoisted(() => vi.fn(() => ({ kind: 'oidc-client' })))
const createAbpReactOidcAuth = vi.hoisted(() =>
  vi.fn(({ client }: { client: unknown }) => ({
    client,
    getAccessToken: vi.fn(),
    login: vi.fn(),
  })),
)

vi.mock('@volo/abp-oidc-auth', () => ({
  createAbpOidcAuth,
}))

vi.mock('@volo/abp-react-oidc-auth', () => ({
  createAbpReactOidcAuth,
}))

import { initUserManager } from '@/lib/auth/oidc'

describe('initUserManager', () => {
  it('signs in Tsheen_App with authorization code at https://localhost:3000', () => {
    const client = initUserManager()

    expect(createAbpOidcAuth).toHaveBeenCalledTimes(1)
    expect(createAbpOidcAuth).toHaveBeenCalledWith({
      authority: 'https://localhost:44366/',
      clientId: 'Tsheen_App',
      redirectUri: 'https://localhost:3000',
      postLogoutRedirectUri: 'https://localhost:3000',
      silentRedirectUri: 'https://localhost:3000/silent-renew.html',
      responseType: 'code',
      scope: 'offline_access openid profile email phone roles Tsheen',
      automaticSilentRenew: true,
      userStoreType: 'localStorage',
      userStorePrefix: 'oidc.Tsheen_App',
    })
    expect(createAbpReactOidcAuth).toHaveBeenCalledTimes(1)
    expect(client).toBe(createAbpReactOidcAuth.mock.results[0]?.value)
  })
})
