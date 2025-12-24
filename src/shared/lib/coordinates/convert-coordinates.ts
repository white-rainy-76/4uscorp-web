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

/**
 * Сортирует точки waypoints по их положению вдоль маршрута от origin к destination
 * Вычисляет проекцию каждой точки на линию от origin к destination и сортирует по расстоянию
 * @param waypoints - Массив точек для сортировки
 * @param origin - Точка начала маршрута
 * @param destination - Точка окончания маршрута
 * @returns Отсортированный массив точек
 */
export const sortWaypointsAlongRoute = (
  waypoints: google.maps.LatLngLiteral[],
  origin: Coordinate | null,
  destination: Coordinate | null,
): google.maps.LatLngLiteral[] => {
  if (!origin || !destination || waypoints.length === 0) {
    return waypoints
  }

  const originLatLng: google.maps.LatLngLiteral = {
    lat: origin.latitude,
    lng: origin.longitude,
  }
  const destinationLatLng: google.maps.LatLngLiteral = {
    lat: destination.latitude,
    lng: destination.longitude,
  }

  // Создаем копию массива для сортировки
  const sortedWaypoints = [...waypoints]

  // Вычисляем проекцию каждой точки на вектор от origin к destination
  // Используем скалярное произведение для нахождения проекции точки на линию от origin к destination
  const vectorDest = {
    lat: destinationLatLng.lat - originLatLng.lat,
    lng: destinationLatLng.lng - originLatLng.lng,
  }

  // Длина вектора от origin к destination
  const destLength = Math.sqrt(
    vectorDest.lat * vectorDest.lat + vectorDest.lng * vectorDest.lng,
  )

  if (destLength === 0) return sortedWaypoints

  sortedWaypoints.sort((a, b) => {
    const vectorA = {
      lat: a.lat - originLatLng.lat,
      lng: a.lng - originLatLng.lng,
    }
    const vectorB = {
      lat: b.lat - originLatLng.lat,
      lng: b.lng - originLatLng.lng,
    }

    // Проекция точки A на вектор от origin к destination (скалярное произведение)
    const dotA = vectorA.lat * vectorDest.lat + vectorA.lng * vectorDest.lng
    // Проекция точки B на вектор от origin к destination (скалярное произведение)
    const dotB = vectorB.lat * vectorDest.lat + vectorB.lng * vectorDest.lng

    // Сортируем по проекции (точки с меньшей проекцией идут первыми)
    return dotA - dotB
  })

  return sortedWaypoints
}
