import { GasStation } from '../types/gas-station'
import { GasStationDto } from '../types/gas-station.dto'

export const mapGasStations = (dto: GasStationDto[]): GasStation[] => {
  return dto.map((stationDto) => ({
    id: String(stationDto.id),
    name: stationDto.name,
    position: {
      lat: parseFloat(stationDto.latitude),
      lng: parseFloat(stationDto.longitude),
    },
    address: stationDto.address ?? null,
    fuelPrice: {
      price: stationDto.price ? Number(stationDto.price).toFixed(4) : undefined,
      discount: stationDto.discount
        ? Number(stationDto.discount).toFixed(4)
        : undefined,
      finalPrice: stationDto.priceAfterDiscount
        ? Number(stationDto.priceAfterDiscount).toFixed(4)
        : undefined,
    },
    isAlgorithm: stationDto.isAlgorithm ?? null,
    refill: stationDto.refill ?? null,
    stopOrder: stationDto.stopOrder ?? null,
    nextDistanceKm: stationDto.nextDistanceKm
      ? Number(stationDto.nextDistanceKm)
      : null,
    roadSectionId: String(stationDto.roadSectionId),
    fuelLeftBeforeRefill: stationDto.currentFuel ?? null,
    // Legacy fields
    // state: undefined,
    // distanceToLocation: undefined,
    // route: undefined,
  }))
}
