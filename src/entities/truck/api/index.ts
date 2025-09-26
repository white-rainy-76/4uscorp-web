// types and mappers
export { TruckDtoSchema } from './contracts/truck.dto.contract'
export { TruckSchema } from './contracts/truck.contract'
export { TruckGroupSchema } from './contracts/truck-group.contract'
export {
  TruckUnitSchema,
  TruckUnitsResponseSchema,
} from './contracts/truck-unit.contract'
export { mapTruck, mapTrucks } from './mapper/truck.mapper'
export { mapTruckGroup, mapTruckGroups } from './mapper/truck-group.mapper'

// mutations and queries
export {
  truckQueries,
  truckGroupQueries,
  truckUnitQueries,
} from './truck.queries'
