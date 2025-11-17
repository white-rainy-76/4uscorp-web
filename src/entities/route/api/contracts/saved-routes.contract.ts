import { z } from 'zod'

// saved routes
export const SavedRouteItemSchema = z.object({
  id: z.string().uuid(),
  startAddress: z.string().nullable(),
  endAddress: z.string().nullable(),
})

export const GetSavedRoutesSchema = z.array(SavedRouteItemSchema)

// saved route by id
export const GeoJsonSchema = z.object({
  type: z.string().nullable(),
  coordinates: z.array(z.array(z.number())),
})

export const SavedRouteByIdSchema = z.object({
  id: z.string().uuid(),
  geoJson: GeoJsonSchema,
})
