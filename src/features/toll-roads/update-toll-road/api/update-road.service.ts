import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  UpdateTollRoadPayload,
  UpdateTollRoadPayloadSchema,
} from './payload/update-road.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const updateTollRoad = async (
  payload: UpdateTollRoadPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = UpdateTollRoadPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.put(
    `/tolls-api/api/Roads/${validatedPayload.id}/update`,
    validatedPayload,
    authConfig,
  )
}
