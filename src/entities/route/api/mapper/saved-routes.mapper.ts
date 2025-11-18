import { GetSavedRoutesData, GetSavedRoutesDto } from '../../model'
import { GetSavedRoutesSchema } from '../contracts/saved-routes.contract'

export const mapGetSavedRoutesDtoToData = (
  raw: GetSavedRoutesDto,
): GetSavedRoutesData => {
  const mapped = raw.map((item) => ({
    id: item.id,
    startAddress: item.startAddress,
    endAddress: item.endAddress,
  }))

  return GetSavedRoutesSchema.parse(mapped)
}
