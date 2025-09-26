import { z } from 'zod'
import { CompanyDtoSchema } from '../../api/contracts/company.dto.contract'

export type CompanyDto = z.infer<typeof CompanyDtoSchema>
export type CompanyManagerDto = z.infer<
  typeof CompanyDtoSchema.shape.companyManagers.element
>
