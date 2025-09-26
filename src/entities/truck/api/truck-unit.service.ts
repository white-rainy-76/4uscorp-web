import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { TruckUnitsResponseSchema } from './contracts/truck-unit.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getTruckUnits(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Trucks/truckUnits`, authConfig)
    .then(responseContract(TruckUnitsResponseSchema))
}
