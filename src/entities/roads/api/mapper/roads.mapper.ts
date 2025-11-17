import type {
  Road,
  GetRoadsByBoundingBoxResponse,
} from '../../model/types/roads'
import type {
  RoadDto,
  GetRoadsByBoundingBoxResponseDto,
  CoordinateDto,
} from '../../model/types/roads.dto'

/**
 * Maps a single RoadDto from the API to a Road object.
 * @param dto The RoadDto object from the API response.
 * @returns A mapped Road object.
 */
export const mapRoad = (dto: RoadDto): Road => {
  return {
    id: dto.id,
    name: dto.name,
    ref: dto.ref,
    highwayType: dto.highwayType,
    isToll: dto.isToll,
    coordinates: dto.coordinates.map((coord: CoordinateDto) => ({
      lat: coord.latitude,
      lng: coord.longitude,
    })),
  }
}

/**
 * Maps the full API response DTO (GetRoadsByBoundingBoxResponseDto)
 * to the desired application data structure (GetRoadsByBoundingBoxResponse).
 * @param dto The raw DTO object received from the server (already validated by Zod).
 * @returns The mapped GetRoadsByBoundingBoxResponse object.
 */
export const mapGetRoadsByBoundingBox = (
  dto: GetRoadsByBoundingBoxResponseDto,
): GetRoadsByBoundingBoxResponse => {
  return dto.map(mapRoad)
}
