'use client'

import { MapBase, Spinner } from '@/shared/ui'
import { SavedRoutesDirections } from './saved-routes-directions'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import {
  Directions as DirectionType,
  RouteRequestPayload,
} from '@/features/directions/api'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { TollRoad } from '@/entities/toll-roads'
import { TollRoadPolyline } from '@/entities/toll-roads/ui'
import { AxelType } from '@/entities/tolls/api'

interface MapWithSavedRoutesProps {
  isLoading?: boolean
  directionsData?: DirectionType
  directionsMutation?: UseMutateAsyncFunction<
    DirectionType,
    Error,
    RouteRequestPayload,
    unknown
  >
  tolls?: TollWithSection[]
  tollRoads?: TollRoad[]
  onClearWaypointsCallback?: (clearFn: () => void) => void
  selectedAxelType?: AxelType
}

export const MapWithSavedRoutes = ({
  isLoading = false,
  directionsData,
  directionsMutation,
  tolls,
  tollRoads,
  onClearWaypointsCallback,
  selectedAxelType,
}: MapWithSavedRoutesProps) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <MapBase>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}

        {/* Toll roads polylines */}
        {tollRoads &&
          tollRoads.map((tollRoad) => (
            <TollRoadPolyline key={tollRoad.id} road={tollRoad} />
          ))}

        {/* Directions with route polylines and markers */}
        {directionsData && directionsMutation && (
          <SavedRoutesDirections
            data={directionsData}
            directionsMutation={directionsMutation}
            tolls={tolls}
            onClearWaypointsCallback={onClearWaypointsCallback}
            selectedAxelType={selectedAxelType}
          />
        )}
      </MapBase>
    </div>
  )
}
