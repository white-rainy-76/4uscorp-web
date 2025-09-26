import { z } from 'zod'
import { DriverBonusResponseSchema } from '../../api/contracts/driver-bonus.contract'

export type DriverBonusResponse = z.infer<typeof DriverBonusResponseSchema>




