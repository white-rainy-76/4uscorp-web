import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { AddCompanyPayload } from './payload/add-company.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const addCompany = async (
  payload: AddCompanyPayload,
  signal?: AbortSignal,
): Promise<void> => {
  // Валидация payload
  const { AddCompanyPayloadSchema } = await import(
    './payload/add-company.payload'
  )
  AddCompanyPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/trucks-api/Company/add', payload, authConfig)
}
