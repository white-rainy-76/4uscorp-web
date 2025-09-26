import { z } from 'zod'
import { TruckGroupSchema } from '../../api'
import { TruckGroupDtoSchema } from '../../api/contracts/truck-group.dto.contract'

export type TruckGroup = z.infer<typeof TruckGroupSchema>
export type TruckGroupDto = z.infer<typeof TruckGroupDtoSchema>




