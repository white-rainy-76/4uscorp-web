import { api } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import {
  AssignRoutePayload,
  GetRouteByIdPayload,
  GetRoutePayload,
} from './types/route.payload'
import {
  AssignRoutePayloadSchema,
  GetRouteByIdPayloadSchema,
  GetRoutePayloadSchema,
} from './payload/route.payload'
import { RouteByIdData, RouteData } from './types/route'
import {
  RouteByIdDtoSchema,
  RouteDataDtoSchema,
} from './contracts/route.contract.dto'
import { mapRouteDataDtoToRouteData } from './mapper/map-route'
import { mapRouteByIdDtoToRouteById } from './mapper/map-route-by-id'

export const getRoute = async (
  payload: GetRoutePayload,
  signal?: AbortSignal,
): Promise<RouteData> => {
  const validatedPayload = GetRoutePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-current-route`,
      validatedPayload,
      config,
    )
    .then(responseContract(RouteDataDtoSchema))

  return mapRouteDataDtoToRouteData(response.data)
}

export const getRouteById = async (
  payload: GetRouteByIdPayload,
  signal?: AbortSignal,
): Promise<RouteByIdData> => {
  const validatedPayload = GetRouteByIdPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-fuel-route-byId`,
      validatedPayload,
      config,
    )
    .then(responseContract(RouteByIdDtoSchema))

  return mapRouteByIdDtoToRouteById(response.data)
}
export const assignRoute = async (
  payload: AssignRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = AssignRoutePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  await api.post(
    `/fuelroutes-api/FuelRoute/AssignRoute`,
    validatedPayload,
    config,
  )
}
