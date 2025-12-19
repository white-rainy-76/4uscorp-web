import { z } from 'zod'

// saved routes
export const SavedRouteItemSchema = z.object({
  id: z.string().uuid(),
  startAddress: z.string().nullable(),
  endAddress: z.string().nullable(),
  name: z.string().nullable().optional(),
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

// get all saved routes
export const LocationSchema = z.object({
  address: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
})

export const GetAllSavedRouteItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  startLocation: LocationSchema,
  endLocation: LocationSchema,
})

export const GetAllSavedRouteSchema = z.array(GetAllSavedRouteItemSchema)
