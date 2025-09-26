import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import {
  AssignRoutePayload,
  GetRouteByIdPayload,
  GetRoutePayload,
  GetDistancePayload,
} from '../model'
import {
  AssignRoutePayloadSchema,
  GetRouteByIdPayloadSchema,
  GetRoutePayloadSchema,
  GetDistancePayloadSchema,
} from './payload/route.payload'
import {
  RouteByIdData,
  RouteData,
  GetDistanceData,
  FuelStationStatus,
} from '../model'
import {
  RouteByIdDtoSchema,
  RouteDataDtoSchema,
  GetDistanceDtoSchema,
  FuelStationStatusResponseSchema,
} from './contracts/route.dto.contract'
import { mapRouteDataDtoToRouteData } from './mapper/route.mapper'
import { mapRouteByIdDtoToRouteById } from './mapper/route-by-id.mapper'
import { mapFuelStationStatusDtoToFuelStationStatus } from './mapper/fuel-station-status.mapper'
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

export const assignRoute = async (
  payload: AssignRoutePayload,
  signal?: AbortSignal,
): Promise<void> => {
  const validatedPayload = AssignRoutePayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post(
    `/fuelroutes-api/FuelRoute/AssignRoute`,
    validatedPayload,
    authConfig,
  )
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

export const getFuelStationArrived = async (
  routeId: string,
  config?: AxiosRequestConfig,
): Promise<FuelStationStatus[]> => {
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .get(
      `/truckstracking-api/TrucksTracking/GetFuelStationArrived/${routeId}`,
      authConfig,
    )
    .then(responseContract(FuelStationStatusResponseSchema))

  return response.data.fuelStations.map(
    mapFuelStationStatusDtoToFuelStationStatus,
  )
}
