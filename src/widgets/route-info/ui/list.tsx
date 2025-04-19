import { RouteIndicator } from '@/shared/ui/route-indicator'
import React from 'react'
import { FuelStopInfo } from './card'
interface FuelStop {
  gallons: number
  logoSrc: string
  address: string
  price: number
  truckStopName: string
}
const fakeFuelStops: FuelStop[] = [
  {
    gallons: 35,
    logoSrc: '/images/TA.png',
    address: '241.79mi - US N Hwy 93, MM 29; LAS VEGAS, AZ',
    price: 3.064,
    truckStopName: 'TA Truck Stop',
  },
  {
    gallons: 52,
    logoSrc: '/images/TA.png',
    address: '220.75mi - I-15, Blue Diamond Exit 33,LAS VEGAS,NV',
    price: 3.299,
    truckStopName: 'Shell',
  },
  {
    gallons: 28,
    logoSrc: '/images/TA.png',
    address: '456 Oak Ave, Someville, TX',
    price: 3.159,
    truckStopName: 'BP',
  },
  {
    gallons: 41,
    logoSrc: '/images/TA.png',
    address: '789 Pine Ln, Othercity, FL',
    price: 3.349,
    truckStopName: 'Exxon',
  },
]
export const RouteList = () => {
  return (
    <div className="flex gap-6">
      {/* Левый индикатор */}
      <div className="mt-3">
        <RouteIndicator pointCount={fakeFuelStops.length} />
      </div>
      {/* Список элементов */}
      <div className="flex flex-col space-y-6 w-full">
        {fakeFuelStops.map((stop, index) => (
          <FuelStopInfo key={index} fuelStop={stop} />
        ))}
      </div>
    </div>
  )
}
