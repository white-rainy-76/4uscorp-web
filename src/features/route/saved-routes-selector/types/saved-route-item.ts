export interface SavedRouteItem {
  id: string
  startAddress: string | null
  endAddress: string | null
  name?: string | null
  startLatitude?: number
  startLongitude?: number
  endLatitude?: number
  endLongitude?: number
}
