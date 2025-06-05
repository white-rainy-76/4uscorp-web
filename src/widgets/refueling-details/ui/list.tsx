import { RouteIndicator } from '@/shared/ui'
import React from 'react'
import { FuelStopInfo } from './card'
import { GasStation } from '@/entities/gas-station'

interface RouteListProps {
  gasStations: GasStation[]
}

export const RouteList = ({ gasStations }: RouteListProps) => {
  const algorithmStations = gasStations
    .filter((station) => station.isAlgorithm)
    .sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0))

  return (
    <div className="flex gap-6">
      <div className="mt-3">
        <RouteIndicator pointCount={algorithmStations.length} />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        {algorithmStations.map((station, index) => (
          <FuelStopInfo
            key={station.id}
            station={station}
            isLast={index === algorithmStations.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
