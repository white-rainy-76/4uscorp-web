import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { TruckUnitsResponseDtoSchema } from './contracts/truck-unit.dto.contract'
import { mapTruckUnits } from './mapper/truck-unit.mapper'
import { TruckUnit } from '../model/types/truck-unit'
import { useAuthStore } from '@/shared/store/auth-store'

export function getTruckUnits(
  config?: AxiosRequestConfig,
): Promise<{ data: TruckUnit[] }> {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Trucks/truckUnits`, authConfig)
    .then(responseContract(TruckUnitsResponseDtoSchema))
    .then((response) => ({
      data: mapTruckUnits(response.data),
    }))
}
