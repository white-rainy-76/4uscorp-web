import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { GetGasStationsPayload } from '../model'
import { GetGasStationsResponse } from '../model'
import { GetGasStationsPayloadSchema } from './payload/gas-stations.payload'

import {
  GetGasStationsResponseDtoSchema,
  FuelStationStatusResponseSchema,
} from './contracts/gas-station.dto.contract'
import { mapGetGasStations } from './mapper/gas-station.mapper'
import { mapFuelStationStatusDtoToFuelStationStatus } from './mapper/fuel-station-status.mapper'
import { FuelStationStatus } from '../model/types/fuel-station-status'
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

export const getFuelStationArrived = async (
  routeId: string,
  config?: AxiosRequestConfig,
): Promise<FuelStationStatus[]> => {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .get(
      `/truckstracking-api/TrucksTracking/GetFuelStationArrived/${routeId}`,
      authConfig,
    )
    .then(responseContract(FuelStationStatusResponseSchema))

  return response.data.fuelStations.map(
    mapFuelStationStatusDtoToFuelStationStatus,
  )
}
