import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { SetUserRolePayload } from './payload/set-user-role.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const setUserRole = async (
  payload: SetUserRolePayload,
  signal?: AbortSignal,
): Promise<void> => {
  // Валидация payload
  const { SetUserRolePayloadSchema } = await import(
    './payload/set-user-role.payload'
  )
  SetUserRolePayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/auth-api/User/set-user-role', payload, authConfig)
}
