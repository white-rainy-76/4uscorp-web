export interface Coordinates {
  latitude: number
  longitude: number
}

export interface RouteRequestPayload {
  origin: Coordinates
  destination: Coordinates
  ViaPoints?: Coordinates[]
}

export interface PointRequestPayload {
  latitude: number
  longitude: number
}
