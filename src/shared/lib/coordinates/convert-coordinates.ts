import { Coordinate } from '@/shared/types'

/**
 * Преобразует массив точек Google Maps (lat/lng) в массив координат (latitude/longitude)
 * @param points - Массив точек в формате Google Maps { lat, lng }
 * @returns Массив координат в формате { latitude, longitude }
 */
export const convertLatLngToCoordinates = (
  points: google.maps.LatLngLiteral[],
): Coordinate[] => {
  return points.map((point) => ({
    latitude: point.lat,
    longitude: point.lng,
  }))
}

/**
 * Преобразует массив координат (latitude/longitude) в массив точек Google Maps (lat/lng)
 * @param coordinates - Массив координат в формате { latitude, longitude }
 * @returns Массив точек в формате Google Maps { lat, lng }
 */
export const convertCoordinatesToLatLng = (
  coordinates: Coordinate[],
): google.maps.LatLngLiteral[] => {
  return coordinates.map((coord) => ({
    lat: coord.latitude,
    lng: coord.longitude,
  }))
}

/**
 * Преобразует одну точку Google Maps (lat/lng) в координату (latitude/longitude)
 * @param point - Точка в формате Google Maps { lat, lng }
 * @returns Координата в формате { latitude, longitude }
 */
export const convertLatLngToCoordinate = (
  point: google.maps.LatLngLiteral,
): Coordinate => {
  return {
    latitude: point.lat,
    longitude: point.lng,
  }
}

/**
 * Преобразует координату (latitude/longitude) в точку Google Maps (lat/lng)
 * @param coordinate - Координата в формате { latitude, longitude }
 * @returns Точка в формате Google Maps { lat, lng }
 */
export const convertCoordinateToLatLng = (
  coordinate: Coordinate,
): google.maps.LatLngLiteral => {
  return {
    lat: coordinate.latitude,
    lng: coordinate.longitude,
  }
}

/**
 * Преобразует массив пар координат [lat, lng] в массив точек Google Maps
 * @param pairs - Массив кортежей [latitude, longitude]
 * @returns Массив точек в формате Google Maps { lat, lng }
 */
export const convertCoordinatePairsToLatLng = (
  pairs: [number, number][],
): google.maps.LatLngLiteral[] => {
  return pairs.map(([lat, lng]) => ({ lat, lng }))
}

/**
 * Преобразует координату (latitude/longitude) в пару координат [latitude, longitude]
 * @param coordinate - Координата в формате { latitude, longitude }
 * @returns Кортеж [latitude, longitude]
 */
export const convertCoordinateToPair = (
  coordinate: Coordinate,
): [number, number] => {
  return [coordinate.latitude, coordinate.longitude]
}
