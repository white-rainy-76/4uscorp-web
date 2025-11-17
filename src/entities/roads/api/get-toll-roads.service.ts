import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import {
  GetTollRoadsPayload,
  GetTollRoadsPayloadSchema,
} from './payload/roads.payload'
import { GetTollRoadsResponse } from '../model/types/roads'
import { GetTollRoadsResponseDtoSchema } from './contracts/roads.dto.contract'
import { mapGetTollRoads } from './mapper/roads.mapper'
import { useAuthStore } from '@/shared/store/auth-store'

export const getTollRoads = async (
  payload: GetTollRoadsPayload,
  signal?: AbortSignal,
): Promise<GetTollRoadsResponse> => {
  const validatedPayload = GetTollRoadsPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-toll-roads`,
      validatedPayload,
      authConfig,
    )
    .then(responseContract(GetTollRoadsResponseDtoSchema))

  return mapGetTollRoads(response.data)
}
