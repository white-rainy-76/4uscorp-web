import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  DeleteRoadPayload,
  DeleteRoadPayloadSchema,
} from './payload/delete-road.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const deleteRoad = async (
  payload: DeleteRoadPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = DeleteRoadPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.delete(
    `/tolls-api/api/Roads/${validatedPayload.id}/delete`,
    authConfig,
  )
}
