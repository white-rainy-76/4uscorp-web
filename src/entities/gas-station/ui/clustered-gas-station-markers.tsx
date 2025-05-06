'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import {
  type Marker,
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer'
import { GasStationMarker } from './gas-station-marker'
import { GasStation } from '../model/gas-station'

type Props = {
  gasStations: GasStation[]
}

export const ClusteredGasStationMarkers: React.FC<Props> = ({
  gasStations,
}) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({})
  const map = useMap()

  const clusterer = useMemo(() => {
    if (!map) return null

    return new MarkerClusterer({
      map,
      algorithm: new SuperClusterAlgorithm({
        // maxZoom: 1,
      }),
    })
  }, [map])

  useEffect(() => {
    if (!clusterer) return
    clusterer.clearMarkers()
    clusterer.addMarkers(Object.values(markers))
  }, [clusterer, markers])

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key])) return markers

      if (marker) {
        return { ...markers, [key]: marker }
      } else {
        const { [key]: _, ...newMarkers } = markers

        return newMarkers
      }
    })
  }, [])

  return (
    <>
      {gasStations.map((station) => (
        <GasStationMarker
          key={station.id}
          gasStation={station}
          setMarkerRef={setMarkerRef}
        />
      ))}
    </>
  )
}
