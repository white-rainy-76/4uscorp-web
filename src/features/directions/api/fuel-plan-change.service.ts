import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/shared/store/auth-store'
import {
  FuelPlanChangePayload,
  FuelPlanChangeResponse,
  FuelPlanChangePayloadSchema,
  FuelPlanChangeResponseSchema,
} from './types/fuel-plan-change'

export const changeFuelPlan = async (
  payload: FuelPlanChangePayload,
  signal?: AbortSignal,
): Promise<FuelPlanChangeResponse> => {
  const validatedPayload = FuelPlanChangePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/change-fuel-plan`,
      validatedPayload,
      authConfig,
    )
    .then(responseContract(FuelPlanChangeResponseSchema))

  return response.data
}
