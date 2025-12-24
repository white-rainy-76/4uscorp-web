import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  DeleteTollRoadPayload,
  DeleteTollRoadPayloadSchema,
} from './payload/delete-road.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const deleteTollRoad = async (
  payload: DeleteTollRoadPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = DeleteTollRoadPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.delete(
    `/tolls-api/api/Roads/${validatedPayload.id}/delete`,
    authConfig,
  )
}
