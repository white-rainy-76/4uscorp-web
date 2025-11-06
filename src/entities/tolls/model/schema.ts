import { z } from 'zod'

export const DEFAULT_COORDINATES = {
  minLat: '24.0', // South (Florida, Texas)
  minLon: '-125.0', // West (California)
  maxLat: '50.0', // North (Canada border)
  maxLon: '-66.0', // East (Maine, Florida)
}

// Схема для формы (работает со строками для удобства ввода)
export const tollSearchFormSchema = z
  .object({
    minLat: z
      .string()
      .min(1, 'Min Latitude is required')
      .refine(
        (val) => {
          if (val === '' || val === '-') return false
          const num = parseFloat(val)
          return !isNaN(num) && isFinite(num) && num >= -90 && num <= 90
        },
        {
          message: 'Min Latitude must be between -90 and 90',
        },
      ),
    minLon: z
      .string()
      .min(1, 'Min Longitude is required')
      .refine(
        (val) => {
          if (val === '' || val === '-') return false
          const num = parseFloat(val)
          return !isNaN(num) && isFinite(num) && num >= -180 && num <= 180
        },
        {
          message: 'Min Longitude must be between -180 and 180',
        },
      ),
    maxLat: z
      .string()
      .min(1, 'Max Latitude is required')
      .refine(
        (val) => {
          if (val === '' || val === '-') return false
          const num = parseFloat(val)
          return !isNaN(num) && isFinite(num) && num >= -90 && num <= 90
        },
        {
          message: 'Max Latitude must be between -90 and 90',
        },
      ),
    maxLon: z
      .string()
      .min(1, 'Max Longitude is required')
      .refine(
        (val) => {
          if (val === '' || val === '-') return false
          const num = parseFloat(val)
          return !isNaN(num) && isFinite(num) && num >= -180 && num <= 180
        },
        {
          message: 'Max Longitude must be between -180 and 180',
        },
      ),
  })
  .superRefine((data, ctx) => {
    // Проверяем min/max только если оба поля валидны
    const minLat = parseFloat(data.minLat)
    const maxLat = parseFloat(data.maxLat)

    // Проверяем, что оба значения валидны и не являются пустыми строками или только минусом
    const isMinLatValid =
      data.minLat !== '' &&
      data.minLat !== '-' &&
      !isNaN(minLat) &&
      isFinite(minLat) &&
      minLat >= -90 &&
      minLat <= 90

    const isMaxLatValid =
      data.maxLat !== '' &&
      data.maxLat !== '-' &&
      !isNaN(maxLat) &&
      isFinite(maxLat) &&
      maxLat >= -90 &&
      maxLat <= 90

    if (isMinLatValid && isMaxLatValid) {
      if (minLat >= maxLat) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min Latitude must be less than Max Latitude',
          path: ['minLat'],
        })
      }
    }

    const minLon = parseFloat(data.minLon)
    const maxLon = parseFloat(data.maxLon)

    const isMinLonValid =
      data.minLon !== '' &&
      data.minLon !== '-' &&
      !isNaN(minLon) &&
      isFinite(minLon) &&
      minLon >= -180 &&
      minLon <= 180

    const isMaxLonValid =
      data.maxLon !== '' &&
      data.maxLon !== '-' &&
      !isNaN(maxLon) &&
      isFinite(maxLon) &&
      maxLon >= -180 &&
      maxLon <= 180

    if (isMinLonValid && isMaxLonValid) {
      if (minLon >= maxLon) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min Longitude must be less than Max Longitude',
          path: ['minLon'],
        })
      }
    }
  })

export type TollSearchFormValues = z.infer<typeof tollSearchFormSchema>
