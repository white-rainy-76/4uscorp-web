import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { AttachDetachDriverPayload } from './payload/attach-detach-driver.payload'
import {
  AttachDetachDriverResponse,
  AttachDetachDriverResponseSchema,
} from './contracts/attach-detach-driver.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export const detachDriver = async (
  payload: AttachDetachDriverPayload,
  signal?: AbortSignal,
): Promise<AttachDetachDriverResponse> => {
  // Валидация payload
  const { AttachDetachDriverPayloadSchema } = await import(
    './payload/attach-detach-driver.payload'
  )
  AttachDetachDriverPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post('trucks-api/Trucks/detach-driver', payload, authConfig)
    .then((res) => res.data)

  return response
}
