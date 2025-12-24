import { GetAllSavedRouteDto } from '../../model'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'

export const mapGetAllSavedRouteToSavedRouteItems = (
  dto: GetAllSavedRouteDto,
): SavedRouteItem[] => {
  return dto.map((route) => ({
    id: route.id,
    startAddress: route.startLocation.address,
    endAddress: route.endLocation.address,
    name: route.name,
    startLatitude: route.startLocation.latitude,
    startLongitude: route.startLocation.longitude,
    endLatitude: route.endLocation.latitude,
    endLongitude: route.endLocation.longitude,
  }))
}
