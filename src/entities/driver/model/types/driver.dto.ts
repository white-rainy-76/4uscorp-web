import { z } from 'zod'
import { DriverDtoSchema } from '../../api/contracts/driver.dto.contract'

export type DriverDto = z.infer<typeof DriverDtoSchema>
