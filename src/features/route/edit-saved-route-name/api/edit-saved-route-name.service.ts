import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  EditSavedRouteNamePayload,
  EditSavedRouteNamePayloadSchema,
} from './payload/edit-saved-route-name.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const editSavedRouteName = async (
  payload: EditSavedRouteNamePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = EditSavedRouteNamePayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.put(
    '/fuelroutes-api/FuelRoute/editSavedRouteName',
    validatedPayload,
    authConfig,
  )
}
