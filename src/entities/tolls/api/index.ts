// schemas and mappers
export { TollDtoSchema } from './contracts/tolls.dto.contract'
export { TollSchema } from './contracts/tolls.contract'
export { mapToll, mapGetTollsByBoundingBox } from './mapper/tolls.mapper'

// mutations and queries
export { useGetTollsByBoundingBoxMutation } from './get-tolls-by-bounding-box.mutation'
