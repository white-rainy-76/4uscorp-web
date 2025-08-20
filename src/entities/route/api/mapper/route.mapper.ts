import { RouteData, RouteDataDto } from '../../model'
import { RouteDataSchema } from '../contracts/route.contract'

export const mapRouteDataDtoToRouteData = (raw: RouteDataDto): RouteData => {
  const mapped = {
    truckId: raw.truckId,
    originName: raw.originName,
    destinationName: raw.destinationName,
    origin: raw.origin,
    destination: raw.destination,
    weight: raw.weight,
    route: raw.routeDto.isRoute
      ? {
          isRoute: true,
          currentLocation: null,
          formattedLocation: raw.routeDto.formattedLocation,
          routeId: raw.routeDto.routeId,
          mapPoints: raw.routeDto.mapPoints.map((point) => ({
            lat: point.latitude,
            lng: point.longitude,
          })),
        }
      : {
          isRoute: false,
          currentLocation: raw.routeDto.currentLocation,
          formattedLocation: raw.routeDto.formattedLocation,
          routeId: null,
          mapPoints: raw.routeDto.mapPoints,
        },
  }

  return RouteDataSchema.parse(mapped)
}
