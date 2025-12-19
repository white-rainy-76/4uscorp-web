import { Coordinate } from '@/shared/types'

export type SavedRoutesRouteParams = {
  origin: Coordinate
  destination: Coordinate
  originName: string
  destinationName: string
}

export type SavedRoutesFetchRouteParams = {
  savedRouteId: string
}
