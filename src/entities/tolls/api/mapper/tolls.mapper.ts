import type {
  Toll,
  GetTollsByBoundingBoxResponse,
} from '../../model/types/tolls'
import type {
  TollDto,
  GetTollsByBoundingBoxResponseDto,
} from '../../model/types/tolls.dto'

/**
 * Maps a single TollDto from the API to a Toll object.
 * @param dto The TollDto object from the API response.
 * @returns A mapped Toll object.
 */
export const mapToll = (dto: TollDto): Toll => {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    position: {
      lat: dto.latitude,
      lng: dto.longitude,
    },
    roadId: dto.roadId,
    key: dto.key ?? null,
    comment: dto.comment ?? null,
    isDynamic: dto.isDynamic,
    nodeId: dto.nodeId,
  }
}

/**
 * Maps the full API response DTO (GetTollsByBoundingBoxResponseDto)
 * to the desired application data structure (GetTollsByBoundingBoxResponse).
 * @param dto The raw DTO object received from the server (already validated by Zod).
 * @returns The mapped GetTollsByBoundingBoxResponse object.
 */
export const mapGetTollsByBoundingBox = (
  dto: GetTollsByBoundingBoxResponseDto,
): GetTollsByBoundingBoxResponse => {
  return dto.map(mapToll)
}
