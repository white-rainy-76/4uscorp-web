import { api, authorizedRequest } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { DirectionsDtoSchema } from './contracts/direction.contract.dto'
import { mapDirections } from './mapper/direction.mapper'
import { ActionType, Directions } from './types/directions'
import { Coordinate } from '@/shared/types'
import {
  PointRequestPayload,
  RouteRequestPayload,
} from './types/directions.payload'
import { AxiosRequestConfig } from 'axios'
import {
  PointRequestPayloadSchema,
  RouteRequestPayloadSchema,
} from './payload/directions.payload'
import { CoordinatesDtoSchema } from '@/shared/api/contracts/coordinates.dto.contract'
import { useAuthStore } from '@/shared/store/auth-store'

export const handleFuelRoute = async (
  payload: RouteRequestPayload,
  action: ActionType,
  signal?: AbortSignal,
): Promise<Directions> => {
  const validatedPayload = RouteRequestPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  let endpoint: string
  switch (action) {
    case 'create':
      endpoint = `/fuelroutes-api/FuelRoute/create-fuel-route`
      break
    case 'edit':
      endpoint = `/fuelroutes-api/FuelRoute/edit-fuel-route`
      break
    default:
      throw new Error(`Unknown action type: ${action}`)
  }

  const response = await api
    .post(endpoint, validatedPayload, authConfig)
    .then(responseContract(DirectionsDtoSchema))

  return mapDirections(response.data)
}

export const getNearestDropPoint = async (
  payload: PointRequestPayload,
  signal?: AbortSignal,
): Promise<Coordinate> => {
  const validatedPayload = PointRequestPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/drop-point-V2`,
      validatedPayload,
      authConfig,
    )
    .then(responseContract(CoordinatesDtoSchema))

  return {
    latitude: response.data.latitude,
    longitude: response.data.longitude,
  }
}

export const cancelDirectionsCreation = async (
  signal?: AbortSignal,
): Promise<void> => {
  const config: AxiosRequestConfig = { signal }
  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post(
    `/fuelroutes-api/FuelRoute/canselation-create-fuel-route-canselation`,
    {},
    authConfig,
  )
}
