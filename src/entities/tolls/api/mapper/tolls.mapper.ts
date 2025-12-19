import type {
  Toll,
  TollPrice,
  GetTollsByBoundingBoxResponse,
} from '../../model/types/tolls'
import type {
  TollDto,
  TollPriceDto,
  GetTollsByBoundingBoxResponseDto,
} from '../../model/types/tolls.dto'

/**
 * Maps a single TollPriceDto from the API to a TollPrice object.
 * @param dto The TollPriceDto object from the API response.
 * @returns A mapped TollPrice object.
 */
export const mapTollPrice = (dto: TollPriceDto): TollPrice => {
  return {
    id: dto.id,
    tollId: dto.tollId,
    calculatePriceId: dto.calculatePriceId,
    paymentType: dto.paymentType,
    axelType: dto.axelType,
    timeOfDay: dto.timeOfDay,
    dayOfWeekFrom: dto.dayOfWeekFrom,
    dayOfWeekTo: dto.dayOfWeekTo,
    timeFrom: dto.timeFrom,
    timeTo: dto.timeTo,
    description: dto.description ?? null,
    amount: dto.amount,
  }
}

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
    websiteUrl: dto.websiteUrl ?? null,
    position: {
      lat: dto.latitude,
      lng: dto.longitude,
    },
    roadId: dto.roadId,
    key: dto.key ?? null,
    comment: dto.comment ?? null,
    isDynamic: dto.isDynamic,
    nodeId: dto.nodeId,
    iPass: dto.iPass,
    iPassOvernight: dto.iPassOvernight,
    payOnline: dto.payOnline,
    payOnlineOvernight: dto.payOnlineOvernight,
    routeSection: dto.routeSection ?? null,
    tag: dto.tag,
    noPlate: dto.noPlate,
    cash: dto.cash,
    noCard: dto.noCard,
    app: dto.app,
    tollPrices: dto.tollPrices?.map(mapTollPrice),
    isEntry: dto.isEntry ?? false,
    isExit: dto.isExit ?? false,
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
