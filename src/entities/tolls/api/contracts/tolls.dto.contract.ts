import { z } from 'zod'

export const TollPriceDtoSchema = z.object({
  id: z.string(),
  tollId: z.string().nullable(),
  calculatePriceId: z.string().nullable(),
  paymentType: z.number().nullable(),
  axelType: z.number(),
  timeOfDay: z.number().nullable(),
  dayOfWeekFrom: z.number().nullable(),
  dayOfWeekTo: z.number().nullable(),
  timeFrom: z.string().nullable(),
  timeTo: z.string().nullable(),
  description: z.string().nullable().optional(),
  amount: z.number(),
})

export const TollDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  websiteUrl: z.string().nullable().optional(),
  latitude: z.number(),
  longitude: z.number(),
  roadId: z.string(),
  key: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  isDynamic: z.boolean().optional(),
  nodeId: z.number().optional(),
  iPass: z.number().optional(),
  iPassOvernight: z.number().optional(),
  payOnline: z.number().optional(),
  payOnlineOvernight: z.number().optional(),
  routeSection: z.string().nullable().optional(),
  tag: z.boolean().optional(),
  noPlate: z.boolean().optional(),
  cash: z.boolean().optional(),
  noCard: z.boolean().optional(),
  app: z.boolean().optional(),
  tollPrices: z.array(TollPriceDtoSchema).optional(),
  isEntry: z.boolean().optional(),
  isExit: z.boolean().optional(),
})

export const GetTollsByBoundingBoxResponseDtoSchema = z.array(TollDtoSchema)
