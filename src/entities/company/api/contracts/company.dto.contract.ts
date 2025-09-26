import { z } from 'zod'

export const CompanyManagerDtoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyId: z.string().uuid(),
  fullName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CompanyDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
  driversCount: z.number(),
  trucksCount: z.number(),
  companyManagers: z.array(CompanyManagerDtoSchema),
})
