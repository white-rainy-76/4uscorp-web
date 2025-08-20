import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  UpdateDriverPayload,
  UpdateDriverPayloadSchema,
} from './payload/update-driver.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const updateDriver = async (
  payload: UpdateDriverPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = UpdateDriverPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post(
    '/trucks-api/Driver/update-driver-contact',
    validatedPayload,
    authConfig,
  )
}
