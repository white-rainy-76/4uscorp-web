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
    address: stationDto.address,
    fuelPrice: {
      price:
        stationDto.price !== undefined && stationDto.price !== null
          ? Number(stationDto.price).toFixed(4)
          : undefined,
      discount:
        stationDto.discount !== undefined && stationDto.discount !== null
          ? Number(stationDto.discount).toFixed(4)
          : undefined,
      finalPrice:
        stationDto.priceAfterDiscount !== undefined &&
        stationDto.priceAfterDiscount !== null
          ? Number(stationDto.priceAfterDiscount).toFixed(4)
          : undefined,
    },
  }))
}
