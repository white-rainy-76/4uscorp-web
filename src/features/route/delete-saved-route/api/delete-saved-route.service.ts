import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  DeleteSavedRoutePayload,
  DeleteSavedRoutePayloadSchema,
} from './payload/delete-saved-route.payload'

import { useAuthStore } from '@/shared/store/auth-store'

export const deleteSavedRoute = async (
  payload: DeleteSavedRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = DeleteSavedRoutePayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.delete(
    `/fuelroutes-api/FuelRoute/SavedRoutes/${validatedPayload.id}`,
    authConfig,
  )
}
