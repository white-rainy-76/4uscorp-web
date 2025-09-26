import { z } from 'zod'
import { AttachDetachDriverResponseSchema } from '../../api/contracts/attach-detach-driver.contract'

export type AttachDetachDriverResponse = z.infer<
  typeof AttachDetachDriverResponseSchema
>




