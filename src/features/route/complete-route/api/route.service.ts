import { api } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { completeRoutePayloadSchema } from './payload/route.payload'
import { CompleteRoutePayload } from '../types/route.payload'

export const completeRoute = async (
  payload: CompleteRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = completeRoutePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  await api.post(
    `/fuelroutes-api/FuelRoute/complete-route`,
    validatedPayload,
    config,
  )
}
