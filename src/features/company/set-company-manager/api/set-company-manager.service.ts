import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { SetCompanyManagerPayload } from './payload/set-company-manager.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const setCompanyManager = async (
  payload: SetCompanyManagerPayload,
  signal?: AbortSignal,
): Promise<void> => {
  // Валидация payload
  const { SetCompanyManagerPayloadSchema } = await import(
    './payload/set-company-manager.payload'
  )
  SetCompanyManagerPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/trucks-api/Company/set-company-manager', payload, authConfig)
}
