import { api } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { UpdateGasStationsPayload } from './types/gas-station.payload'
import { GasStation } from './types/gas-station'
import { UpdateGasStationsPayloadSchema } from './payload/gas-stations.payload'
import { mapGasStations } from './mapper/map-gas-stations'
import { GasStationDtoSchema } from './contracts/gas-station.contract.dto'

export const updateGasStations = async (
  payload: UpdateGasStationsPayload,
  signal?: AbortSignal,
): Promise<GasStation[]> => {
  const validatedPayload = UpdateGasStationsPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-fuel-stations`,
      validatedPayload,
      config,
    )
    .then(responseContract(GasStationDtoSchema.array()))

  return mapGasStations(response.data)
}
