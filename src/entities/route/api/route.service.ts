import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import {
  GetRouteByIdPayload,
  GetRoutePayload,
  GetDistancePayload,
} from '../model'
import {
  GetRouteByIdPayloadSchema,
  GetRoutePayloadSchema,
  GetDistancePayloadSchema,
} from './payload/route.payload'
import { RouteByIdData, RouteData, GetDistanceData } from '../model'
import {
  RouteByIdDtoSchema,
  RouteDataDtoSchema,
  GetDistanceDtoSchema,
} from './contracts/route.dto.contract'
import { mapRouteDataDtoToRouteData } from './mapper/route.mapper'
import { mapRouteByIdDtoToRouteById } from './mapper/route-by-id.mapper'
import { useAuthStore } from '@/shared/store/auth-store'

export const getRoute = async (
  payload: GetRoutePayload,
  signal?: AbortSignal,
): Promise<RouteData> => {
  const validatedPayload = GetRoutePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-current-route`,
      validatedPayload,
      authConfig,
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
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/get-fuel-route-byId`,
      validatedPayload,
      authConfig,
    )
    .then(responseContract(RouteByIdDtoSchema))

  return mapRouteByIdDtoToRouteById(response.data)
}

export const getDistance = async (
  payload: GetDistancePayload,
  signal?: AbortSignal,
): Promise<GetDistanceData> => {
  const validatedPayload = GetDistancePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = {
    signal,
    params: validatedPayload,
  }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .get(`/fuelroutes-api/FuelRoute/get-distance`, authConfig)
    .then(responseContract(GetDistanceDtoSchema))

  return response.data
}
