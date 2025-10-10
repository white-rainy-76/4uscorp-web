'use client'

import React from 'react'
import { useDictionary } from '@/shared/lib/hooks'

interface MapError {
  stationId: string
  message: string
}

interface MapErrorsOverlayProps {
  errors: MapError[]
}

export const MapErrorsOverlay: React.FC<MapErrorsOverlayProps> = ({
  errors,
}) => {
  const { dictionary } = useDictionary()

  if (errors.length === 0) return null

  // Разделяем ошибки на общие, связанные с конкретными заправками и ошибки валидации маршрута
  const generalErrors = errors.filter((error) => error.stationId === 'general')
  const stationErrors = errors.filter(
    (error) =>
      error.stationId !== 'general' && error.stationId !== 'route-validation',
  )
  const routeValidationErrors = errors.filter(
    (error) => error.stationId === 'route-validation',
  )

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md">
        <div className="flex items-center">
          <div className="text-red-500 mr-2">⚠️</div>
          <div>
            <h4 className="font-bold text-sm mb-2">
              {dictionary.home.errors.error}:
            </h4>
            <div className="space-y-1">
              {/* Ошибки валидации маршрута */}
              {routeValidationErrors.map((error, index) => (
                <div key={`route-validation-${index}`} className="text-xs">
                  <span className="font-semibold text-red-800">
                    {dictionary.home.errors.error}:
                  </span>
                  <span className="ml-2">{error.message}</span>
                </div>
              ))}
              {/* Общие ошибки */}
              {generalErrors.map((error, index) => (
                <div key={`general-${index}`} className="text-xs">
                  <span className="font-semibold text-red-800">
                    {dictionary.home.errors.error}:
                  </span>
                  <span className="ml-2">{error.message}</span>
                </div>
              ))}
              {/* Ошибки конкретных заправок */}
              {stationErrors.map((error, index) => (
                <div key={`station-${index}`} className="text-xs">
                  <span className="font-semibold">
                    {dictionary.home.route_panel.address}{' '}
                    {error.stationId.slice(0, 8)}...
                  </span>
                  <span className="ml-2">{error.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
