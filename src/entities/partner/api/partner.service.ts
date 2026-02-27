import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { PartnerDtoSchema } from './contracts/partner.dto.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getAllPartners(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Partner/all`, authConfig)
    .then(responseContract(z.array(PartnerDtoSchema)))
}
