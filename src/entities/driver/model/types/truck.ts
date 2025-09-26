import { z } from 'zod'

import { TruckInfoSchema } from '../../api/contracts/driver.contract'
import { TruckInfoDtoSchema } from '../../api/contracts/driver.dto.contract'

export type TruckInfo = z.infer<typeof TruckInfoSchema>
export type TruckInfoDto = z.infer<typeof TruckInfoDtoSchema>
