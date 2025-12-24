import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  EditSavedRoutePayload,
  EditSavedRoutePayloadSchema,
} from './payload/edit-saved-route.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const editSavedRoute = async (
  payload: EditSavedRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = EditSavedRoutePayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.put(
    '/fuelroutes-api/FuelRoute/editSavedRoute',
    validatedPayload,
    authConfig,
  )
}
