import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { PriceLoadAttemptsResponseSchema } from './contracts/price-load-attempt.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getPriceLoadAttempts(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/fuelstations-api/FuelStation/price-load-attempts`, authConfig)
    .then(responseContract(PriceLoadAttemptsResponseSchema))
}
