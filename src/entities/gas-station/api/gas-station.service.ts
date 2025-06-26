import { api } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { UpdateGasStationsPayload } from './types/gas-station.payload'
import { GetGasStationsResponse } from './types/gas-station'
import { UpdateGasStationsPayloadSchema } from './payload/gas-stations.payload'
import { mapGetGasStationsResponseDtoToResponse } from './mapper/map-gas-stations'
import { GetGasStationsResponseDtoSchema } from './contracts/gas-station.contract.dto'

export const updateGasStations = async (
  payload: UpdateGasStationsPayload,
  signal?: AbortSignal,
): Promise<GetGasStationsResponse> => {
  const validatedPayload = UpdateGasStationsPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-fuel-stations`,
      validatedPayload,
      config,
    )
    .then(responseContract(GetGasStationsResponseDtoSchema))

  return mapGetGasStationsResponseDtoToResponse(response.data)
}
