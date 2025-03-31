export interface GasStationDto {
  id: number
  latitude: string
  longitude: string
  name?: string
  address?: string
  state?: string
  price?: number
  discount?: number
  price_after_discount?: string
  distance_to_location?: number
  image?: {
    tile?: string
  }
  route?: number
}
