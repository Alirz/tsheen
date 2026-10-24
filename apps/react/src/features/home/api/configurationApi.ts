import { api } from '@/lib/api/axios'

export interface CurrentUserDto {
  isAuthenticated: boolean
  userName?: string | null
  name?: string | null
}

export interface ApplicationConfigurationDto {
  currentUser: CurrentUserDto
  auth?: {
    grantedPolicies?: Record<string, boolean>
  }
}

export const configurationApi = {
  get: () => api.get<ApplicationConfigurationDto>('/abp/application-configuration').then((response) => response.data),
}
