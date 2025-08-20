import { z } from 'zod'

export const DriverBonusResponseSchema = z.void()

export type DriverBonusResponse = z.infer<typeof DriverBonusResponseSchema>




