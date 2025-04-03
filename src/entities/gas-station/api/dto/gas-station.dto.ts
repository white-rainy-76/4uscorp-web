export interface GasStationDto {
  id: number
  latitude: string
  longitude: string
  name?: string
  address?: string
  state?: string
  price?: number
  discount?: number
  priceAfterDiscount?: string
  distanceToLocation?: number
  image?: {
    tile?: string
  }
  route?: number
}
