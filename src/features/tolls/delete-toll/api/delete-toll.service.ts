import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  DeleteTollPayload,
  DeleteTollPayloadSchema,
} from './payload/delete-toll.payload'

import { useAuthStore } from '@/shared/store/auth-store'

export const deleteToll = async (
  payload: DeleteTollPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = DeleteTollPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.delete(`/tolls-api/api/Tolls/${validatedPayload.id}`, authConfig)
}
