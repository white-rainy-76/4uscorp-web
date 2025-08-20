import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { GetGasStationsPayload } from '../model'
import { GetGasStationsResponse } from '../model'
import { GetGasStationsPayloadSchema } from './payload/gas-stations.payload'

import { GetGasStationsResponseDtoSchema } from './contracts/gas-station.dto.contract'
import { mapGetGasStations } from './mapper/gas-station.mapper'
import { useAuthStore } from '@/shared/store/auth-store'

export const getGasStations = async (
  payload: GetGasStationsPayload,
  signal?: AbortSignal,
): Promise<GetGasStationsResponse> => {
  const validatedPayload = GetGasStationsPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-fuel-stations`,
      validatedPayload,
      authConfig,
    )
    .then(responseContract(GetGasStationsResponseDtoSchema))

  return mapGetGasStations(response.data)
}
