import { z } from 'zod'
import { env } from '@/env'

const dynamicEnvSchema = z.object({
  application: z.object({
    baseUrl: z.string(),
    name: z.string(),
  }),
  oAuthConfig: z.object({
    issuer: z.string(),
    redirectUri: z.string(),
    clientId: z.string(),
    scope: z.string(),
  }),
  apis: z.object({
    default: z.object({
      url: z.string(),
      rootNamespace: z.string().optional(),
    }),
  }),
})

export type DynamicEnv = z.infer<typeof dynamicEnvSchema>

let loadedConfig: DynamicEnv | null = null

export async function loadRuntimeConfig(): Promise<void> {
  const response = await fetch('/dynamic-env.json', { cache: 'no-store' })
  if (!response.ok) {
    return
  }

  loadedConfig = dynamicEnvSchema.parse(await response.json())
}

export function getOAuthConfig() {
  return {
    issuer: loadedConfig?.oAuthConfig.issuer ?? env.oauth.issuer,
    redirectUri: loadedConfig?.oAuthConfig.redirectUri ?? env.oauth.redirectUri,
    clientId: loadedConfig?.oAuthConfig.clientId ?? env.oauth.clientId,
    scope: loadedConfig?.oAuthConfig.scope ?? env.oauth.scope,
    responseType: 'code' as const,
  }
}

export function getApplicationName(): string {
  return loadedConfig?.application.name ?? 'Tsheen'
}

export function getApiUrl(): string {
  return loadedConfig?.apis.default.url ?? env.apiUrl
}

export function getApiBaseUrl(): string {
  const apiUrl = getApiUrl()
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    return `${apiUrl.replace(/\/$/, '')}/api`
  }

  if (import.meta.env.DEV) {
    return '/api'
  }

  return `${apiUrl.replace(/\/$/, '')}/api`
}
