import { z } from 'zod'

// saved routes
export const SavedRouteItemDtoSchema = z.object({
  id: z.string().uuid(),
  startAddress: z.string().nullable(),
  endAddress: z.string().nullable(),
  name: z.string().nullable().optional(),
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

// get all saved routes
export const LocationDtoSchema = z.object({
  address: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
})

export const GetAllSavedRouteItemDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  startLocation: LocationDtoSchema,
  endLocation: LocationDtoSchema,
})

export const GetAllSavedRouteDtoSchema = z.array(GetAllSavedRouteItemDtoSchema)
