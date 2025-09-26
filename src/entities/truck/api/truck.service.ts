import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { TruckDtoSchema } from './contracts/truck.dto.contract'
import { z } from 'zod'
import { useAuthStore } from '@/shared/store/auth-store'

export function getAllTrucks(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Trucks/get-truck-list`, authConfig)
    .then(responseContract(z.array(TruckDtoSchema)))
}

export function getTruckById(id: string, config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Trucks/get-truckBy-id?truckId=${id}`, authConfig)
    .then(responseContract(TruckDtoSchema))
}
