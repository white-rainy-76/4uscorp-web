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
  //console.log(gasStations)
  // Очистка маркеров при изменении gasStations
  useEffect(() => {
    if (!clusterer) return

    // Полная очистка всех маркеров и кластеров
    clusterer.clearMarkers()

    // Очистка состояния маркеров
    setMarkers({})
  }, [gasStations, clusterer])

  // Добавление маркеров в кластер при их изменении
  useEffect(() => {
    if (!clusterer) return

    // Очищаем перед добавлением новых маркеров
    clusterer.clearMarkers()

    // Добавляем только существующие маркеры
    const existingMarkers = Object.values(markers).filter(
      (marker) => marker !== null,
    )
    if (existingMarkers.length > 0) {
      clusterer.addMarkers(existingMarkers)
    }
  }, [clusterer, markers])

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((prevMarkers) => {
      // Если маркер уже существует и новый маркер такой же, не обновляем
      if ((marker && prevMarkers[key]) || (!marker && !prevMarkers[key])) {
        return prevMarkers
      }

      if (marker) {
        return { ...prevMarkers, [key]: marker }
      } else {
        // Удаляем маркер из состояния
        const { [key]: removedMarker, ...newMarkers } = prevMarkers
        return newMarkers
      }
    })
  }, [])

  // Cleanup при размонтировании компонента
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
