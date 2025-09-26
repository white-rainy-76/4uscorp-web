import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { SetTruckGroupWeightFuelPayload } from './payload/set-truck-group-weight-fuel.payload'
import {
  SetTruckGroupWeightFuelResponse,
  SetTruckGroupWeightFuelResponseSchema,
} from './contracts/set-truck-group-weight-fuel.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export const setTruckGroupWeightFuel = async (
  payload: SetTruckGroupWeightFuelPayload,
  signal?: AbortSignal,
): Promise<SetTruckGroupWeightFuelResponse> => {
  // Валидация payload
  const { SetTruckGroupWeightFuelPayloadSchema } = await import(
    './payload/set-truck-group-weight-fuel.payload'
  )
  SetTruckGroupWeightFuelPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      '/trucks-api/ModelTruckGroups/set-WeightAndFuelCapacit',
      payload,
      authConfig,
    )
    .then((res) => res.data)

  return response
}
