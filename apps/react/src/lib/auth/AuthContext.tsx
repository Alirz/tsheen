import { useEffect, type ReactNode } from 'react'
import { appConfig } from '@/lib/auth/permissions'
import { getAuthClient } from '@/lib/auth/oidc'

export function useAuth() {
  return getAuthClient().useAuth()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = getAuthClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('code') || !params.has('state')) {
      return
    }

    if (window.location.pathname.endsWith('/silent-renew.html')) {
      return
    }

    void client.handleSigninCallback().then(() => {
      window.history.replaceState({}, document.title, window.location.pathname)
    })
  }, [client])

  return (
    <client.AuthProvider
      onSignedIn={() => {
        void client.getAccessToken().then((token) => appConfig.fetchConfig(token))
      }}
    >
      {children}
    </client.AuthProvider>
  )
}

export async function authGuard({ location }: { location: { href: string } }) {
  const userManager = getAuthClient().getUserManager()
  const user = await userManager.getUser()
  if (!user || user.expired) {
    await userManager.signinRedirect({
      state: { returnUrl: location.href },
    })
    throw new Error('Redirecting to login')
  }
}
