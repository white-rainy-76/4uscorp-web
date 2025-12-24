// schemas and mappers
export {
  TollRoadDtoSchema,
  GetTollRoadsResponseDtoSchema,
} from './contracts/toll-roads.dto.contract'
export {
  TollRoadSchema,
  GetTollRoadsResponseSchema,
  GetTollRoadsByBoundingBoxResponseSchema,
} from './contracts/toll-roads.contract'
export {
  mapTollRoad,
  mapGetTollRoadsByBoundingBox,
  mapGetTollRoads,
} from './mapper/toll-roads.mapper'

// mutations and queries
export { useGetTollRoadsByBoundingBoxMutation } from './get-roads-by-bounding-box.mutation'
export { useGetTollRoadsMutation } from './get-toll-roads.mutation'
export { getTollRoads } from './get-toll-roads.service'
