import { SavedRouteByIdData, SavedRouteByIdDto } from '../../model'
import { SavedRouteByIdSchema } from '../contracts/saved-routes.contract'

export const mapSavedRouteByIdDtoToData = (
  raw: SavedRouteByIdDto,
): SavedRouteByIdData => {
  const mapped = {
    id: raw.id,
    geoJson: {
      type: raw.geoJson.type,
      coordinates: raw.geoJson.coordinates,
    },
  }

  return SavedRouteByIdSchema.parse(mapped)
}
