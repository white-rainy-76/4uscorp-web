import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { UserDtoSchema } from './contracts/user.dto.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export function getUserById(id: string, config?: AxiosRequestConfig) {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  return api
    .get(`/auth-api/User/by-id/${id}`, authConfig)
    .then(responseContract(UserDtoSchema))
}

