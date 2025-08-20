import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { DriverDtoSchema } from './contracts/driver.dto.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getAllDrivers(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Driver/get-all`, authConfig)
    .then(responseContract(z.array(DriverDtoSchema)))
}

export function getDriverById(id: string, config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Driver/driver/${id}`, authConfig)
    .then(responseContract(DriverDtoSchema))
}
