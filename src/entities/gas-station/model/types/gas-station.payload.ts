import { z } from 'zod'
import { GetGasStationsPayloadSchema } from '../../api/payload/gas-stations.payload'

export type GetGasStationsPayload = z.infer<typeof GetGasStationsPayloadSchema>
