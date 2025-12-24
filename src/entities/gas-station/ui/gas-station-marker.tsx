import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import Image from 'next/image'
import classNames from 'classnames'
import { CustomPin } from './custom-pin'
import { getLogoUrl } from '../lib/getLogoUrl'
import type { Marker as ClusterMarker } from '@googlemaps/markerclusterer'
import { GasStation } from '../model/types/gas-station'
import { useErrorsStore, useCartStore } from '@/shared/store'

interface Props {
  gasStation: GasStation
  setMarkerRef: (marker: ClusterMarker | null, key: string) => void
  onAddToCart: (station: GasStation, refillLiters: number) => void
  onRemoveFromCart: (stationId: string) => void
  onUpdateRefillLiters: (stationId: string, liters: number) => void
  isInCart: boolean
}

export const GasStationMarker: React.FC<Props> = ({
  gasStation,
  setMarkerRef,
  onAddToCart,
  onRemoveFromCart,
  onUpdateRefillLiters,
  isInCart,
}) => {
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { gasStationErrors } = useErrorsStore()

  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, gasStation.id),
    [setMarkerRef, gasStation.id],
  )

  const errorMessage = gasStationErrors[gasStation.id]

  return (
    <AdvancedMarker
      position={gasStation.position}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={!clicked ? () => setClicked(true) : undefined}
      ref={ref}
      className={classNames('gas-station-marker', { clicked, hovered })}
      zIndex={clicked ? 2000 : isInCart ? 3 : gasStation.isAlgorithm ? 2 : 1}>
      {clicked ? (
        <CustomPin
          gasStation={gasStation}
          setClicked={setClicked}
          isInCart={isInCart}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          onUpdateRefillLiters={onUpdateRefillLiters}
          errorMessage={errorMessage}
        />
      ) : (
        <div
          className={classNames('rounded-md p-1 border text-center', {
            'bg-yellow-100 border-yellow-400':
              gasStation.isAlgorithm && !isInCart, // Алгоритмическая, но не в корзине
            'bg-blue-100 border-blue-400': isInCart, // В корзине (любая)
            'bg-white border-gray-300': !gasStation.isAlgorithm && !isInCart, // Обычная, не в корзине
            'bg-red-100 border-red-400': errorMessage, // При ошибке (приоритет над остальными)
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
              'text-yellow-600': gasStation.isAlgorithm && !isInCart, // Алгоритмическая, но не в корзине
              'text-blue-600': isInCart, // В корзине (любая)
              'text-gray-700': !gasStation.isAlgorithm && !isInCart, // Обычная, не в корзине
              'text-red-600': errorMessage, // При ошибке (приоритет над остальными)
            })}>
            {gasStation.fuelPrice?.finalPrice}
          </span>
          {gasStation.fuelStationProviderId && (
            <p className="text-gray-600">
              Id:{' '}
              <span className="font-bold text-blue-600">
                {gasStation.fuelStationProviderId}
              </span>
            </p>
          )}
        </div>
      )}
    </AdvancedMarker>
  )
}
