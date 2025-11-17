// schemas and mappers
export { RoadDtoSchema } from './contracts/roads.dto.contract'
export { RoadSchema } from './contracts/roads.contract'
export { mapRoad, mapGetRoadsByBoundingBox } from './mapper/roads.mapper'

// mutations and queries
export { useGetRoadsByBoundingBoxMutation } from './get-roads-by-bounding-box.mutation'
export { useGetRoadsByBoundingBoxMutation as useGetTollRoadsByBoundingBoxMutation } from './get-roads-by-bounding-box.mutation'
