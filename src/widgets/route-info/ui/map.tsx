'use client'
import React, { useState } from 'react'
import { Map } from '@vis.gl/react-google-maps'
import { mapOptions } from '../constants/map-options'

import { RouteSearchForm } from '@/features/search-route/ui/route-search-form'

export const MapWidget = () => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.Place | null>(null)
  return (
    <>
      <RouteSearchForm />
      <Map {...mapOptions}></Map>
    </>
  )
}

export default MapWidget
