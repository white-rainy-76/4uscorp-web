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
  onAddToCart: (station: GasStation) => void
  onRemoveFromCart: (stationId: string) => void
  onUpdateRefillLiters: (stationId: string, liters: number) => void
  cart: GasStation[]
}

export const ClusteredGasStationMarkers: React.FC<Props> = ({
  gasStations,
  onAddToCart,
  onRemoveFromCart,
  onUpdateRefillLiters,
  cart,
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

  // Очищаем маркеры и кластеры при изменении заправок
  useEffect(() => {
    if (!clusterer) return
    clusterer.clearMarkers()
    setMarkers({})
  }, [gasStations, clusterer])

  // Добавляем валидные маркеры в кластер (исключая isAlgorithm)
  useEffect(() => {
    if (!clusterer) return

    const validMarkers = Object.entries(markers)
      .filter(([id]) => {
        const station = gasStations.find((s) => s.id === id)
        return station && !station.isAlgorithm
      })
      .map(([, marker]) => marker)

    if (validMarkers.length > 0) {
      clusterer.addMarkers(validMarkers)
    }
  }, [clusterer, markers, gasStations])

  const setMarkerRef = useCallback((marker: Marker | null, id: string) => {
    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [id]: marker }
      } else {
        const { [id]: _, ...rest } = prev
        return rest
      }
    })
  }, [])

  useEffect(() => {
    return () => {
      clusterer?.clearMarkers()
    }
  }, [clusterer])

  return (
    <>
      {gasStations.map((station) => (
        <GasStationMarker
          key={station.id}
          gasStation={station}
          setMarkerRef={setMarkerRef}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateRefillLiters={onUpdateRefillLiters}
          isInCart={cart.some((s) => s.id === station.id)}
        />
      ))}
    </>
  )
}
