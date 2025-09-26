import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { CompanyDtoSchema } from './contracts/company.dto.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getAllCompanies(config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Company/all`, authConfig)
    .then(responseContract(z.array(CompanyDtoSchema)))
}

export function getCompanyById(id: string, config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/trucks-api/Company/by-id/${id}`, authConfig)
    .then(responseContract(CompanyDtoSchema))
}
