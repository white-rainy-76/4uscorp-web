import { api } from '@/shared/api/api.instance'
import { responseContract } from '@/shared/api/api.lib'
import { z } from 'zod'
import { DirectionsDtoSchema } from './contracts/direction.contract.dto'
import { mapDirections } from './mapper/direction.mapper'
import { Directions } from './types/directions'
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
import { CoordinatesDtoSchema } from './contracts/coordinates.dto'

export const getDirections = async (
  payload: RouteRequestPayload,
  signal?: AbortSignal,
): Promise<Directions> => {
  const validatedPayload = RouteRequestPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(
      `/fuelroutes-api/FuelRoute/create-fuel-route`,
      validatedPayload,
      config,
    )
    .then(responseContract(DirectionsDtoSchema))

  return mapDirections(response.data)
}

export const getNearestDropPoint = async (
  payload: PointRequestPayload,
  signal?: AbortSignal,
): Promise<Coordinate> => {
  const validatedPayload = PointRequestPayloadSchema.parse(payload)
  const config: AxiosRequestConfig = { signal }
  const response = await api
    .post(`/fuelroutes-api/FuelRoute/drop-point-V2`, validatedPayload, config)
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
  await api.post(
    `/fuelroutes-api/FuelRoute/canselation-create-fuel-route-canselation`,
    {},
    config,
  )
}
