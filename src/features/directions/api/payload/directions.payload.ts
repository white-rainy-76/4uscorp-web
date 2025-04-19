export interface Coordinates {
  latitude: number
  longitude: number
}

export interface RouteRequestPayload {
  origin: Coordinates
  destination: Coordinates
}
