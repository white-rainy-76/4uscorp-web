// schemas and mappers
export {
  RoadDtoSchema,
  GetTollRoadsResponseDtoSchema,
} from './contracts/roads.dto.contract'
export {
  RoadSchema,
  GetTollRoadsResponseSchema,
} from './contracts/roads.contract'
export {
  mapRoad,
  mapGetRoadsByBoundingBox,
  mapGetTollRoads,
} from './mapper/roads.mapper'

// mutations and queries
export { useGetRoadsByBoundingBoxMutation } from './get-roads-by-bounding-box.mutation'
export { useGetRoadsByBoundingBoxMutation as useGetTollRoadsByBoundingBoxMutation } from './get-roads-by-bounding-box.mutation'
export { useGetTollRoadsMutation } from './get-toll-roads.mutation'
export { getTollRoads } from './get-toll-roads.service'
