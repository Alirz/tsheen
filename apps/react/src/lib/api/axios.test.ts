import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getAccessToken = vi.hoisted(() => vi.fn<() => Promise<string | null>>())

vi.mock('@/lib/auth/oidc', () => ({
  getAuthClient: () => ({
    getAccessToken,
    login: vi.fn(),
  }),
}))

import { api } from '@/lib/api/axios'

describe('api authorization interceptor', () => {
  beforeEach(() => {
    getAccessToken.mockReset()
  })

  it('sets Authorization Bearer from the auth client access token', async () => {
    const seen: Array<{ authorization: unknown; baseURL: string | undefined }> = []
    api.defaults.adapter = (config: InternalAxiosRequestConfig) => {
      seen.push({
        authorization: config.headers.get('Authorization'),
        baseURL: config.baseURL,
      })
      const response = {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse
      return Promise.resolve(response)
    }

    getAccessToken.mockResolvedValueOnce('header.payload.signature')
    const first = await api.get('/connect/userinfo')

    getAccessToken.mockResolvedValueOnce('another.jwt.value')
    const second = await api.get('/connect/userinfo')

    expect(getAccessToken).toHaveBeenCalledTimes(2)
    expect(seen[0]?.authorization).toBe('Bearer header.payload.signature')
    expect(seen[1]?.authorization).toBe('Bearer another.jwt.value')
    expect(seen[0]?.baseURL).toBe('https://localhost:44365/api')
    expect(first.status).toBe(200)
    expect(first.data).toEqual({ ok: true })
    expect(second.status).toBe(200)
  })

  it('leaves Authorization unset when the auth client has no access token', async () => {
    getAccessToken.mockResolvedValueOnce(null)
    let authorization: unknown = 'unset'
    api.defaults.adapter = (config: InternalAxiosRequestConfig) => {
      authorization = config.headers.get('Authorization') ?? null
      return Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse)
    }

    await api.get('/connect/userinfo')

    expect(getAccessToken).toHaveBeenCalledTimes(1)
    expect(authorization).toBeNull()
  })
})
