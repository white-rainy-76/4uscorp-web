import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import {
  DriverBonusPayload,
  DriverBonusPayloadSchema,
} from './payload/driver-bonus.payload'
import { DriverBonusResponse } from './contracts/driver-bonus.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export const decreaseDriverBonus = async (
  payload: DriverBonusPayload,
  signal?: AbortSignal,
): Promise<DriverBonusResponse> => {
  const validatedPayload = DriverBonusPayloadSchema.parse(payload)

  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      '/trucks-api/Trucks/decrease-driver-bonus',
      validatedPayload,
      authConfig,
    )
    .then((res) => res.data)

  return response
}
