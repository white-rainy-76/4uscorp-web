export type CoordinatePair = [number, number]

interface Route {
  routeId: string
  mapPoints: CoordinatePair[]
}

export interface Directions {
  responseId: string
  routeIds: Route[]
}
