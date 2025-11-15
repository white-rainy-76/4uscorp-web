export interface FuelStationStatus {
  fuelStationId: string
  status: 1 | 2 | 3 // 1 - ok, 2 - not ok, 3 - не доехал ещё
}

export type FuelStationStatusType = 1 | 2 | 3
