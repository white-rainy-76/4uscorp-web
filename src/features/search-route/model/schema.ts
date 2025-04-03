import { z } from 'zod'

export const routeSearchSchema = z
  .object({
    startPoint: z.string().min(1, 'departure').refine(Boolean, {
      message: 'departure',
    }),
    endPoint: z.string().min(1, 'arrival').refine(Boolean, {
      message: 'arrival',
    }),
  })
  .refine((data) => data.startPoint !== data.endPoint, {
    message: 'differentPoints',
    path: ['endPoint'],
  })

export type RouteSearchFormValues = z.infer<typeof routeSearchSchema>
