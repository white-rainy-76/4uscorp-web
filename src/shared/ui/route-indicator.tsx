import React from 'react'
import { FuelStationStatusType } from '@/entities/route/model/types/fuel-station-status'
import { Icon } from '@/shared/ui'

interface RouteIndicatorProps {
  pointCount: number
  fuelStationStatuses?: { [fuelStationId: string]: FuelStationStatusType }
  gasStationIds?: string[]
}

export const RouteIndicator = ({
  pointCount,
  fuelStationStatuses = {},
  gasStationIds = [],
}: RouteIndicatorProps) => {
  const getStatusColor = (index: number) => {
    if (!gasStationIds[index]) return 'bg-gray-400' // Серый по умолчанию

    const stationId = gasStationIds[index]
    const status = fuelStationStatuses[stationId]

    switch (status) {
      case 1: // ok
        return 'bg-green-600'
      case 2: // not ok
        return 'bg-red-600'
      case 3: // не доехал ещё
      default:
        return 'bg-gray-400'
    }
  }

  const getConnectorColor = (index: number) => {
    if (!gasStationIds[index]) return 'bg-gray-400'

    const stationId = gasStationIds[index]
    const status = fuelStationStatuses[stationId]

    switch (status) {
      case 1: // ok
        return 'bg-green-600'
      case 2: // not ok
        return 'bg-red-600'
      case 3: // не доехал ещё
      default:
        return 'bg-gray-400'
    }
  }

  const renderStatusIcon = (index: number) => {
    if (!gasStationIds[index]) {
      // Серый по умолчанию - круг с бордером и иконкой marker-gray
      return (
        <div className="flex justify-center items-center w-6 h-6 border border-gray-400 rounded-full bg-transparent">
          <Icon name="common/marker-gray" fill="none" width={12} height={12} />
        </div>
      )
    }

    const stationId = gasStationIds[index]
    const status = fuelStationStatuses[stationId]

    if (status === 3 || status === undefined) {
      // Серый статус - круг с бордером и иконкой marker-gray
      return (
        <div className="flex justify-center items-center w-6 h-6 border border-gray-400 rounded-full bg-transparent">
          <Icon name="common/marker-gray" fill="none" width={12} height={12} />
        </div>
      )
    }

    // Зеленый и красный статусы - заливка с белой точкой
    return (
      <div
        className={`flex justify-center items-center w-6 h-6 ${getStatusColor(index)} rounded-full`}>
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {Array.from({ length: pointCount }).map((_, index) => (
        <div key={index} className="flex flex-col items-center">
          {renderStatusIcon(index)}
          {index < pointCount - 1 && (
            <>
              <div
                className={`w-[3px] h-2 ${getConnectorColor(index)} mb-1 flex-shrink-0`}></div>
              <div
                className={`w-[3px] h-2 ${getConnectorColor(index)} my-1 flex-shrink-0`}></div>
              <div
                className={`w-[3px] h-2 ${getConnectorColor(index)} my-1 flex-shrink-0`}></div>
              <div
                className={`w-[3px] h-2 ${getConnectorColor(index)} mt-1 flex-shrink-0`}></div>
              <div
                className={`w-[3px] h-2 ${getConnectorColor(index)} mt-1 flex-shrink-0`}></div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
