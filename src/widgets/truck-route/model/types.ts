import { Coordinate } from '@/shared/types'
import { Truck } from '@/entities/truck'
import { FuelPlan } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'

export interface TruckRouteInfoProps {
  truck: Truck
  isRoute: boolean
  currentFuelPercent?: number
  onSubmitForm: (payload: RouteFormPayload) => void
  routeId: string | undefined
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
  onRouteCompleted?: () => void
}

export interface RouteFormPayload {
  origin: Coordinate
  destination: Coordinate
  originName: string
  destinationName: string
  truckWeight?: number
  finishFuel?: number
}

export interface RouteInfoDisplayProps {
  isRoute: boolean
  onEdit: () => void
}

export interface RouteInfoEditorProps {
  truck: Truck
  currentFuelPercent?: number
  onSubmitForm: (payload: RouteFormPayload) => void
}

export interface RouteActionsProps {
  truck: Truck
  routeId: string | undefined
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
  onRouteCompleted?: () => void
  submitButtonText: string
}
