'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/shared/ui'
import {
  useSavedRoutesLookup,
  SavedRoutesModal,
  SavedRouteSelection,
  SavedRouteItem,
} from '@/features/route/saved-routes-selector'
import { GooglePlace } from '@/shared/types/place'
import { Coordinate } from '@/shared/types'
import { convertToCoordinate } from '@/shared/lib/coordinates'

interface SavedRouteSelectorProps {
  origin: GooglePlace | Coordinate | null | undefined
  destination: GooglePlace | Coordinate | null | undefined
  onRouteSelect: (savedRouteId: string | undefined) => void
}

export const SavedRouteSelector = ({
  origin,
  destination,
  onRouteSelect,
}: SavedRouteSelectorProps) => {
  const [selectedSavedRoute, setSelectedSavedRoute] =
    useState<SavedRouteItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getOriginCoordinate = () => {
    if (!origin) return null

    if ('location' in origin) {
      return convertToCoordinate((origin as GooglePlace).location)
    }
    return convertToCoordinate(origin as Coordinate)
  }

  const getDestinationCoordinate = () => {
    if (!destination) return null

    if ('location' in destination) {
      return convertToCoordinate((destination as GooglePlace).location)
    }
    return convertToCoordinate(destination as Coordinate)
  }

  const originCoordinate = getOriginCoordinate()
  const destinationCoordinate = getDestinationCoordinate()

  const {
    savedRoutes,
    isLoading: isLoadingSavedRoutes,
    hasSavedRoutes,
  } = useSavedRoutesLookup({
    origin: originCoordinate,
    destination: destinationCoordinate,
    enabled: true,
  })

  // Clear selected saved route when origin or destination changes
  useEffect(() => {
    if (selectedSavedRoute) {
      setSelectedSavedRoute(null)
      onRouteSelect(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination])

  // Notify parent when selected route changes
  useEffect(() => {
    onRouteSelect(selectedSavedRoute?.id)
  }, [selectedSavedRoute, onRouteSelect])

  const handleSelectRoute = (route: SavedRouteItem) => {
    setSelectedSavedRoute(route)
  }

  const handleClearRoute = () => {
    setSelectedSavedRoute(null)
  }

  return (
    <>
      {/* Selected Saved Route Display */}
      {selectedSavedRoute && (
        <div className="mt-4">
          <SavedRouteSelection
            selectedRoute={selectedSavedRoute}
            onClear={handleClearRoute}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      )}

      {/* Saved Routes Button */}
      {!selectedSavedRoute && hasSavedRoutes && !isLoadingSavedRoutes && (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
            onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Use Saved Route ({savedRoutes.length})
            </span>
          </Button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoadingSavedRoutes && (
        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-text-muted">Checking for saved routes...</span>
        </div>
      )}

      {/* Saved Routes Modal */}
      <SavedRoutesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        savedRoutes={savedRoutes}
        onSelect={handleSelectRoute}
      />
    </>
  )
}
