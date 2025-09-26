import { z } from 'zod'

export const CompanyManagerSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyId: z.string().uuid(),
  fullName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  driversCount: z.number(),
  trucksCount: z.number(),
  companyManagers: z.array(CompanyManagerSchema),
})
