import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import i18n from '@/lib/i18n/i18n'
import { getAuthClient } from '@/lib/auth/oidc'
import { getApiBaseUrl } from '@/lib/runtime-config'

interface RetryConfig extends InternalAxiosRequestConfig {
  skipAuthRedirect?: boolean
  skip403Redirect?: boolean
  authRetried?: boolean
}

export const api = axios.create({
  baseURL: '',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
})

async function ensureAccessToken(): Promise<string | null> {
  return getAuthClient().getAccessToken()
}

function isMutatingRequest(method: string | undefined): boolean {
  const normalized = method?.toLowerCase()
  return normalized === 'post' || normalized === 'put' || normalized === 'patch' || normalized === 'delete'
}

api.interceptors.request.use(async (config) => {
  config.baseURL = getApiBaseUrl()

  const accessToken = await ensureAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  const tenantId = sessionStorage.getItem('abp_tenant_id')
  if (tenantId && !config.headers.__tenant) {
    config.headers.__tenant = tenantId
  }

  if (i18n.language) {
    config.headers['Accept-Language'] = config.headers['Accept-Language'] ?? i18n.language
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const config = error.config as RetryConfig | undefined

    if (status === 401 && config && !config.skipAuthRedirect) {
      if (!config.authRetried) {
        config.authRetried = true
        const accessToken = await ensureAccessToken()
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
          return api.request(config)
        }
      }

      await getAuthClient().login()
      return Promise.reject(new Error('Unauthorized'))
    }

    if (status === 403 && config && !config.skip403Redirect && !isMutatingRequest(config.method)) {
      window.location.href = '/403'
      return Promise.reject(new Error('Forbidden'))
    }

    return Promise.reject(error)
  },
)
