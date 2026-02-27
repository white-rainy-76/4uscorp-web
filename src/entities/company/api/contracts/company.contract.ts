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
  parentCompanyId: z.string().uuid().nullable().optional(),
  name: z.string(),
  externalToken: z.string().nullable().optional(),
  driversCount: z.number(),
  trucksCount: z.number(),
  companyManagers: z.array(CompanyManagerSchema),
})
