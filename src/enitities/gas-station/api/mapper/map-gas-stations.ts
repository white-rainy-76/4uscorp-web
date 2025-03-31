import { GasStationDto } from '../dto/gas-station.dto'
import { GasStation } from '../../model/gas-station'

export const mapGasStations = (dto: GasStationDto): GasStation[] => {
  return [dto].map((stationDto) => ({
    id: String(stationDto.id),
    name: stationDto.name,
    position: {
      lat: parseFloat(stationDto.latitude),
      lng: parseFloat(stationDto.longitude),
    },
    address: stationDto.address,
    fuelPrice: {
      price: stationDto.price?.toString(),
      discount: stationDto.discount?.toString(),
      finalPrice: stationDto.price_after_discount,
    },
  }))
}
