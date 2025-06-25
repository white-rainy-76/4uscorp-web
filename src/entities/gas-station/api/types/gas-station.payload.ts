import { z } from 'zod'
import { UpdateGasStationsPayloadSchema } from '../payload/gas-stations.payload'

export type UpdateGasStationsPayload = z.infer<
  typeof UpdateGasStationsPayloadSchema
>
