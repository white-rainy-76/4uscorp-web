import { z } from 'zod'
import {
  CompanyManagerSchema,
  CompanySchema,
} from '../../api/contracts/company.contract'

export type Company = z.infer<typeof CompanySchema>
export type CompanyManager = z.infer<typeof CompanyManagerSchema>
