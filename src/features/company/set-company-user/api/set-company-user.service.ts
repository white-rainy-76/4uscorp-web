import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { SetCompanyUserPayload } from './payload/set-company-user.payload'
import {
  SetCompanyUserResponse,
  SetCompanyUserResponseSchema,
} from './contracts/set-company-user.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export const setCompanyUser = async (
  payload: SetCompanyUserPayload,
  signal?: AbortSignal,
): Promise<SetCompanyUserResponse> => {
  // Валидация payload
  const { SetCompanyUserPayloadSchema } = await import(
    './payload/set-company-user.payload'
  )
  SetCompanyUserPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post('/auth-api/User/set-company', payload, authConfig)
    .then(responseContract(SetCompanyUserResponseSchema))

  return response.data
}
