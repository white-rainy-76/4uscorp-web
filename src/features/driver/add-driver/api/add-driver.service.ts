import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  AddDriverPayload,
  AddDriverPayloadSchema,
} from './payload/add-driver.payload'

import { useAuthStore } from '@/shared/store/auth-store'

export const addDriver = async (
  payload: AddDriverPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = AddDriverPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/trucks-api/Driver/Create', validatedPayload, authConfig)
}
