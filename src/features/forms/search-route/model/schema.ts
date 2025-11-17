import { z } from 'zod'

export const routeSearchSchema = z
  .object({
    startPoint: z.string().min(1, 'departure').refine(Boolean, {
      message: 'departure',
    }),
    endPoint: z.string().min(1, 'arrival').refine(Boolean, {
      message: 'arrival',
    }),
    weight: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (Number(val) >= 0 && Number(val) <= 100_000 && !isNaN(Number(val))),
        'invalidWeight',
      ),
    fuelPercent: z
      .number({ invalid_type_error: 'invalidFuel' })
      .min(0, 'minFuel')
      .max(500, 'maxFuel')
      .optional(),
  })
  .refine((data) => data.startPoint !== data.endPoint, {
    message: 'differentPoints',
    path: ['endPoint'],
  })

export type RouteSearchFormValues = z.infer<typeof routeSearchSchema>
