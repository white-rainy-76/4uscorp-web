import { z } from 'zod'

// saved routes
export const SavedRouteItemDtoSchema = z.object({
  id: z.string().uuid(),
  startAddress: z.string().nullable(),
  endAddress: z.string().nullable(),
})

export const GetSavedRoutesDtoSchema = z.array(SavedRouteItemDtoSchema)

// saved route by id
export const GeoJsonDtoSchema = z.object({
  type: z.string().nullable(),
  coordinates: z.array(z.array(z.number())),
})

export const SavedRouteByIdDtoSchema = z.object({
  id: z.string().uuid(),
  geoJson: GeoJsonDtoSchema,
})
