import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import {
  GetTollsAlongPolylineSectionsPayload,
  GetTollsAlongPolylineSectionsPayloadSchema,
} from './payload/get-tolls-along-polyline-sections.payload'
import {
  GetTollsAlongPolylineSectionsResponse,
  GetTollsAlongPolylineSectionsResponseSchema,
} from '../types/toll-with-section'
import { useAuthStore } from '@/shared/store/auth-store'

export const getTollsAlongPolylineSections = async (
  payload: GetTollsAlongPolylineSectionsPayload,
  signal?: AbortSignal,
): Promise<GetTollsAlongPolylineSectionsResponse> => {
  const validatedPayload =
    GetTollsAlongPolylineSectionsPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-tolls-along-polyline-sections`,
      validatedPayload,
      authConfig,
    )
    .then(responseContract(GetTollsAlongPolylineSectionsResponseSchema))

  return response.data
}
