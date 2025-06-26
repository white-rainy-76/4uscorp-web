import { z } from 'zod'

export const GasStationDtoSchema = z.object({
  id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  name: z.string().nullable(), // name: "TA"
  address: z.string().optional().nullable(), // address: "I-10 at Milliken Avenue,COLTON"
  price: z.string().optional().nullable(), // price: "5.06"
  discount: z.string().optional().nullable(), // discount: "0.31"
  priceAfterDiscount: z.string().optional().nullable(), // priceAfterDiscount: "4.75"
  isAlgorithm: z.boolean().optional().nullable(), // isAlgorithm: false
  refill: z.string().optional().nullable(), // refill: null
  stopOrder: z.number().optional().nullable(), // stopOrder: 0
  nextDistanceKm: z.string().optional().nullable(), // nextDistanceKm: null
  roadSectionId: z.string(), // roadSectionId: "d3a9ca2f-27d2-47e8-a534-f6062d96c7a2"
  currentFuel: z.number().nullable().optional(), // currentFuel: 0
})

export const FinishInfoDtoSchema = z.object({
  remainingFuelLiters: z.number(), // remainingFuelLiters: 59.99
})

export const GetGasStationsResponseDtoSchema = z.object({
  fuelStations: z.array(GasStationDtoSchema),
  finishInfo: FinishInfoDtoSchema,
})
