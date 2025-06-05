'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useMap } from '@vis.gl/react-google-maps'
import {
  type Marker,
  MarkerClusterer,
  SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer'
import { GasStationMarker } from './gas-station-marker'
import { GasStation } from '../api/types/gas-station'

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
      algorithm: new SuperClusterAlgorithm({}),
    })
  }, [map])

  // Очистка маркеров при изменении gasStations
  useEffect(() => {
    if (!clusterer) return

    // Полная очистка всех маркеров и кластеров
    clusterer.clearMarkers()
    setMarkers({})
  }, [gasStations, clusterer])

  // Добавление маркеров в кластер (исключая isAlgorithm: true)
  useEffect(() => {
    if (!clusterer) return

    clusterer.clearMarkers()

    const existingMarkers = Object.entries(markers)
      .filter(([key, marker]) => {
        const station = gasStations.find((s) => s.id === key)
        return marker && station && !station.isAlgorithm
      })
      .map(([, marker]) => marker!)

    if (existingMarkers.length > 0) {
      clusterer.addMarkers(existingMarkers)
    }
  }, [clusterer, markers, gasStations])

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((prevMarkers) => {
      if ((marker && prevMarkers[key]) || (!marker && !prevMarkers[key])) {
        return prevMarkers
      }

      if (marker) {
        return { ...prevMarkers, [key]: marker }
      } else {
        const { [key]: _, ...newMarkers } = prevMarkers
        return newMarkers
      }
    })
  }, [])

  // Очистка кластеров при размонтировании
  useEffect(() => {
    return () => {
      if (clusterer) {
        clusterer.clearMarkers()
      }
    }
  }, [clusterer])

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
