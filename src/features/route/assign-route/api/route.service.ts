import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { assignRoutePayloadSchema } from './payload/route.payload'
import { AssignRoutePayload } from '../types/route.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const assignRoute = async (
  payload: AssignRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = assignRoutePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)
  await api.post(
    `/fuelroutes-api/FuelRoute/AssignRoute`,
    validatedPayload,
    authConfig,
  )
}
