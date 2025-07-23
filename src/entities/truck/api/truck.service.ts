import { api } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { TruckDtoSchema } from './contracts/truck.contract.dto'
import { z } from 'zod'

export function getAllTrucks(config?: AxiosRequestConfig) {
  return api
    .get(`/trucks-api/Trucks/get-truck-list`, config)
    .then(responseContract(z.array(TruckDtoSchema)))
}

export function getTruckById(id: string, config?: AxiosRequestConfig) {
  return api
    .get(`/trucks-api/Trucks/get-truckBy-id?truckId=${id}`, config)
    .then(responseContract(TruckDtoSchema))
}
