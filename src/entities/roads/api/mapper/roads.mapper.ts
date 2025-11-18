import type {
  Road,
  GetRoadsByBoundingBoxResponse,
  GetTollRoadsResponse,
} from '../../model/types/roads'
import type {
  RoadDto,
  GetRoadsByBoundingBoxResponseDto,
  GetTollRoadsResponseDto,
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

/**
 * Maps the full API response DTO (GetTollRoadsResponseDto)
 * to the desired application data structure (GetTollRoadsResponse).
 * @param dto The raw DTO object received from the server (already validated by Zod).
 * @returns The mapped GetTollRoadsResponse object.
 */
export const mapGetTollRoads = (
  dto: GetTollRoadsResponseDto,
): GetTollRoadsResponse => {
  return dto.map(mapRoad)
}
