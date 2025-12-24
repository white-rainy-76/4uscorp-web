// schemas and mappers
export {
  TollPriceDtoSchema,
  TollDtoSchema,
} from './contracts/tolls.dto.contract'
export { TollPriceSchema, TollSchema } from './contracts/tolls.contract'
export { mapToll, mapGetTollsByBoundingBox } from './mapper/tolls.mapper'

// enums (re-exported from model)
export {
  TollPaymentType,
  TollPriceTimeOfDay,
  TollPriceDayOfWeek,
  AxelType,
} from '../model/types/tolls.enums'

// mutations and queries
export { useGetTollsByBoundingBoxMutation } from './get-tolls-by-bounding-box.mutation'
