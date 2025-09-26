import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { TruckGroupSchema } from './contracts/truck-group.contract'
import { z } from 'zod'
import { useAuthStore } from '@/shared/store/auth-store'

export function getAllTruckGroups(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/ModelTruckGroups/All`, authConfig)
    .then(responseContract(z.array(TruckGroupSchema)))
}

export function getTruckGroupById(id: string, config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/ModelTruckGroups/${id}`, authConfig)
    .then(responseContract(TruckGroupSchema))
}
