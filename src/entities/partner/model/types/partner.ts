import { z } from 'zod'
import { PartnerSchema } from '../../api/contracts/partner.contract'

export type Partner = z.infer<typeof PartnerSchema>
