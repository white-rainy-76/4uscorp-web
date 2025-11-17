import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  SaveBestFuelRoutePayload,
  SaveBestFuelRoutePayloadSchema,
} from './payload/save-best-fuel-route.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const saveBestFuelRoute = async (
  payload: SaveBestFuelRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = SaveBestFuelRoutePayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/fuelroutes-api/FuelRoute/Save', validatedPayload, authConfig)
}
