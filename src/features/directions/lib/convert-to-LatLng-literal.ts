import { CoordinatePair } from '../api/types/directions'

export const convertToLatLngLiteral = (
  coords: CoordinatePair[],
): google.maps.LatLngLiteral[] => {
  return coords.map(([lat, lng]) => ({ lat, lng }))
}
