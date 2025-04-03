'use client'
import React, { useState } from 'react'
import { Map } from '@vis.gl/react-google-maps'
import { mapOptions } from '../constants/map-options'
import { RouteSearchForm } from '@/features/search-route/ui/route-search-form'
import { Directions } from '@/features/directions/ui/directions'
import { GasStationMarker } from '@/entities/gas-station/ui/gas-station-marker'
import { useQuery } from '@tanstack/react-query'
import { gasStationQueries } from '@/entities/gas-station/api'
import { useRouteStore } from '@/features/search-route/model/route-store'
import { v4 as uuidv4 } from 'uuid'

export const MapWidget = () => {
  const { origin, destination } = useRouteStore()
  const { data, isLoading, isError, error } = useQuery({
    ...gasStationQueries.list({
      radius: 15,
      source: origin,
      destination: destination,
    }),
  })

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null)
  return (
    <>
      <RouteSearchForm />
      <Map colorScheme="LIGHT" {...mapOptions}>
        <Directions />
        {isLoading && (
          <div className="absolute top-4 right-4 z-10 bg-white text-blue-700 p-2 rounded-lg shadow-lg">
            Loading...
          </div>
        )}
        {isError && (
          <div className="absolute top-4 right-4 z-10 bg-red-100 text-red-700 p-2 rounded-lg shadow-lg">
            Error: {error?.message || 'Не удалось загрузить заправки'}
          </div>
        )}
        {data &&
          data.map((gasStation) => (
            <GasStationMarker key={uuidv4()} gasStation={gasStation} />
          ))}
      </Map>
    </>
  )
}

export default MapWidget
