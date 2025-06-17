export type TruckLocationUpdate = {
  truckId: string
  longitude: number
  latitude: number
  headingDegrees: number
  time: string
  truckName: string
}
export type TruckFuelUpdate = {
  truckId: string
  fuelPercentage: string
}
