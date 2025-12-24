import { Coordinate } from '@/shared/types'

/**
 * Converts Google Maps LatLng or Coordinate to unified Coordinate format
 * @param location - Google Maps LatLng object or Coordinate object
 * @returns Coordinate object with latitude and longitude or null
 */
export function convertToCoordinate(
  location: google.maps.LatLng | Coordinate | null | undefined,
): Coordinate | null {
  if (!location) return null

  // Check if already in Coordinate format
  if ('latitude' in location && 'longitude' in location) {
    return location
  }

  // Convert from LatLng to Coordinate
  return {
    latitude: location.lat(),
    longitude: location.lng(),
  }
}
