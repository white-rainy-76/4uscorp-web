import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  AddTollRoadPayload,
  AddTollRoadPayloadSchema,
} from './payload/add-road.payload'
import { useAuthStore } from '@/shared/store/auth-store'

export const addTollRoad = async (
  payload: AddTollRoadPayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = AddTollRoadPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post('/tolls-api/api/Roads/addRoad', validatedPayload, authConfig)
}
