'use client'

import React from 'react'
import { useDictionary } from '@/shared/lib/hooks'
import { useErrorsStore } from '@/shared/store'

export const MapErrorsOverlay: React.FC = () => {
  const { dictionary } = useDictionary()
  const { globalErrors, gasStationGlobalErrors, gasStationErrors } =
    useErrorsStore()

  const hasErrors =
    globalErrors.length > 0 ||
    gasStationGlobalErrors.length > 0 ||
    Object.keys(gasStationErrors).length > 0

  if (!hasErrors) return null

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
              {/* Глобальные ошибки из get-gas-stations (validationError) */}
              {globalErrors.map((error, index) => (
                <div key={`global-${index}`} className="text-xs">
                  <span className="font-semibold text-red-800">
                    {dictionary.home.errors.error}:
                  </span>
                  <span className="ml-2">{error}</span>
                </div>
              ))}
              {/* Глобальные ошибки от change-fuel-plan */}
              {gasStationGlobalErrors.map((error, index) => (
                <div key={`gas-station-global-${index}`} className="text-xs">
                  <span className="font-semibold text-red-800">
                    {dictionary.home.errors.error}:
                  </span>
                  <span className="ml-2">{error}</span>
                </div>
              ))}
              {/* Ошибки конкретных заправок */}
              {Object.entries(gasStationErrors).map(([stationId, error]) => (
                <div key={`station-${stationId}`} className="text-xs">
                  <span className="font-semibold">
                    {dictionary.home.route_panel.address}{' '}
                    {stationId.slice(0, 8)}...
                  </span>
                  <span className="ml-2">{error}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
