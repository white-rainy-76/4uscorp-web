import { GasStation } from '@/entities/gas-station'

export type CoordinatePair = [number, number]

export interface Route {
  routeId: string
  mapPoints: CoordinatePair[]
}

export interface Directions {
  responseId: string
  routeDtos: Route[]
  gasStations: GasStation[]
}
