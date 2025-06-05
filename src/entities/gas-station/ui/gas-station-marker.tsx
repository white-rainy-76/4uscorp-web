import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import Image from 'next/image'
import classNames from 'classnames'
import { CustomPin } from './custom-pin'
import { getLogoUrl } from '../lib/getLogoUrl'
import type { Marker } from '@googlemaps/markerclusterer'
import { GasStation } from '../api/types/gas-station'

interface Props {
  gasStation: GasStation
  setMarkerRef: (marker: Marker | null, key: string) => void
}

export const GasStationMarker: React.FC<Props> = ({
  gasStation,
  setMarkerRef,
}) => {
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, gasStation.id),
    [setMarkerRef, gasStation.id],
  )
  return (
    <AdvancedMarker
      position={gasStation.position}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      ref={ref}
      className={classNames('gas-station-marker', { clicked, hovered })}
      zIndex={clicked ? 2000 : gasStation.isAlgorithm ? 2 : 1}>
      {clicked ? (
        CustomPin(setClicked, gasStation)
      ) : (
        <div
          className={classNames('rounded-md p-1 border text-center', {
            'bg-yellow-100 border-yellow-400': gasStation.isAlgorithm,
            'bg-white border-gray-300': !gasStation.isAlgorithm,
          })}>
          <Image
            alt="gas-station"
            src={getLogoUrl(gasStation.name)}
            width={32}
            height={32}
            className="mx-auto"
          />
          <span
            className={classNames('block text-sm font-semibold', {
              'text-yellow-600': gasStation.isAlgorithm,
              'text-gray-700': !gasStation.isAlgorithm,
            })}>
            {gasStation.fuelPrice?.finalPrice}
          </span>
        </div>
      )}
    </AdvancedMarker>
  )
}
