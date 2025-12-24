import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  AddSavedRoutePayload,
  AddSavedRoutePayloadSchema,
} from './payload/add-saved-route.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const addSavedRoute = async (
  payload: AddSavedRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = AddSavedRoutePayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/fuelroutes-api/FuelRoute/Save', validatedPayload, authConfig)
}
