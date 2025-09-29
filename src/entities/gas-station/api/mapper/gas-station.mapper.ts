import {
  GasStation,
  GasStationDto,
  GetGasStationsResponse,
  GetGasStationsResponseDto,
  FuelRouteInfo,
  FuelRouteInfoDto,
  FuelPlan,
  FuelPlanDto,
} from '../../model'

/**
 * Maps a single GasStationDto from the API to a GasStation object.
 * @param dto The GasStationDto object from the API response.
 * @returns A mapped GasStation object.
 */
export const mapGasStation = (dto: GasStationDto): GasStation => {
  const price = dto.price ? parseFloat(dto.price) : undefined
  const discount = dto.discount ? parseFloat(dto.discount) : undefined
  const finalPrice = dto.priceAfterDiscount
    ? parseFloat(dto.priceAfterDiscount)
    : undefined

  const lat = parseFloat(dto.latitude)
  const lng = parseFloat(dto.longitude)

  return {
    id: dto.id,
    name: dto.name,
    position: {
      lat: isNaN(lat) ? 0 : lat,
      lng: isNaN(lng) ? 0 : lng,
    },
    address: dto.address,
    fuelPrice: {
      price:
        price !== undefined && !isNaN(price) ? price.toFixed(4) : undefined,
      discount:
        discount !== undefined && !isNaN(discount)
          ? discount.toFixed(4)
          : undefined,
      finalPrice:
        finalPrice !== undefined && !isNaN(finalPrice)
          ? finalPrice.toFixed(4)
          : undefined,
    },
    isAlgorithm: dto.isAlgorithm,
    refill: dto.refill,
    stopOrder: dto.stopOrder,

    nextDistanceKm: dto.nextDistanceKm ? parseFloat(dto.nextDistanceKm) : null,
    roadSectionId: dto.roadSectionId,
    fuelLeftBeforeRefill: dto.currentFuel,
    fuelStationProviderId: dto.fuelStationProviderId,
    state: null, // Or undefined
    distanceToLocation: null, // Or undefined
    route: null, // Or undefined
  }
}

/**
 * Maps a single FuelRouteInfoDto from the API to a FuelRouteInfo object.
 * @param dto The FuelRouteInfoDto object from the API response.
 * @returns A mapped FuelRouteInfo object.
 */
export const mapFuelRouteInfo = (dto: FuelRouteInfoDto): FuelRouteInfo => {
  return {
    roadSectionId: dto.roadSectionId,
    totalPriceAmmount: dto.totalPriceAmmount,
    totalFuelAmmount: dto.totalFuelAmmount,
    finishInfo: dto.finishInfo,
    validationError: dto.validationError,
  }
}

/**
 * Maps a single FuelPlanDto from the API to a FuelPlan object.
 * @param dto The FuelPlanDto object from the API response.
 * @returns A mapped FuelPlan object.
 */
export const mapFuelPlan = (dto: FuelPlanDto): FuelPlan => {
  return {
    routeSectionId: dto.routeSectionId,
    fuelPlanId: dto.fuelPlanId,
  }
}

/**
 * Maps the full API response DTO (GetGasStationsResponseDto)
 * to the desired application data structure (GetGasStationsResponse).
 * @param dto The raw DTO object received from the server (already validated by Zod).
 * @returns The mapped GetGasStationsResponse object.
 */
export const mapGetGasStations = (
  dto: GetGasStationsResponseDto,
): GetGasStationsResponse => {
  return {
    fuelStations: dto.fuelStations.map(mapGasStation),
    fuelRouteInfoDtos: dto.fuelRouteInfoDtos.map(mapFuelRouteInfo),
    fuelPlans: dto.fuelPlans.map(mapFuelPlan),
  }
}
