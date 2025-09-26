import { z } from 'zod'

import { DriverSchema } from '../../api/contracts/driver.contract'

export type Driver = z.infer<typeof DriverSchema>
