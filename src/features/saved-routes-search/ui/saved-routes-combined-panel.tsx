'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { InfoCard } from '@/shared/ui'
import { SavedRoutesSearchForm } from './saved-routes-search-form'
import { SavedRoutesList } from './saved-routes-list'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'
import { AddSavedRouteButton } from '@/features/route/add-saved-route'
import { EditSavedRouteButton } from '@/features/route/edit-saved-route'
import { DeleteSavedRouteButton } from '@/features/route/delete-saved-route'
import { CreateRouteButton } from './create-route-button'
import { useSavedRoutesStore } from '@/shared/store'
import { routeQueries } from '@/entities/route/api/route.queries'

interface SavedRoutesCombinedPanelProps {
  hasSearched?: boolean
  onSearchComplete?: () => void
  className?: string
  onCreateRoute?: () => void
  onRouteSelectAndFetch?: (savedRouteId: string) => void
  isCreatingRoute?: boolean
  onClearWaypoints?: () => void
  onRouteDelete?: () => void
  onRouteUpdate?: () => void
}

export const SavedRoutesCombinedPanel = ({
  hasSearched = false,
  onSearchComplete,
  className = 'w-[420px]',
  onCreateRoute,
  onRouteSelectAndFetch,
  isCreatingRoute = false,
  onClearWaypoints,
  onRouteDelete,
  onRouteUpdate,
}: SavedRoutesCombinedPanelProps) => {
  const { origin, destination, sectionId, savedRouteId, setSavedRouteId } =
    useSavedRoutesStore()

  // Query для получения сохранённых маршрутов
  const { data: savedRoutes = [], isLoading } = useQuery({
    ...routeQueries.savedRoutes({
      startLatitude: origin?.latitude ?? 0,
      startLongitude: origin?.longitude ?? 0,
      endLatitude: destination?.latitude ?? 0,
      endLongitude: destination?.longitude ?? 0,
    }),
    enabled: origin !== null && destination !== null,
  })

  const handleRouteSelect = (route: SavedRouteItem) => {
    setSavedRouteId(route.id)
    onRouteSelectAndFetch?.(route.id)
  }

  const handleRouteActionSuccess = () => {
    // Очищаем waypoints при сохранении маршрута
    onClearWaypoints?.()
    setSavedRouteId(null)
  }

  const handleRouteUpdateSuccess = () => {
    // Очищаем все данные маршрута при обновлении
    onRouteUpdate?.()
  }

  const handleRouteDeleteSuccess = () => {
    // Очищаем все данные маршрута при удалении
    onRouteDelete?.()
  }

  return (
    <div className={`absolute top-4 right-4 bottom-4 z-10 ${className}`}>
      <InfoCard
        title="Saved Routes Search"
        className="shadow-xl border border-border bg-card/95 backdrop-blur-sm h-full flex flex-col overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Form */}
          <div className="flex-shrink-0">
            <SavedRoutesSearchForm
              isLoading={isLoading}
              onSearchComplete={onSearchComplete}
            />

            {/* Create Route Button */}
            {onCreateRoute && (
              <div className="mt-4">
                <CreateRouteButton
                  onCreateRoute={onCreateRoute}
                  isLoading={isCreatingRoute}
                />
              </div>
            )}
          </div>

          {/* Divider */}
          {hasSearched && (
            <>
              <div className="flex items-center gap-3 my-3 flex-shrink-0">
                <div className="h-px flex-1 bg-separator" />
                <span className="text-xs font-bold text-text-heading uppercase tracking-wider">
                  Results
                </span>
                <div className="h-px flex-1 bg-separator" />
              </div>

              {/* Results List */}
              <div className="flex-1 min-h-0 -mx-6 px-6 overflow-hidden">
                <SavedRoutesList
                  routes={savedRoutes}
                  onRouteSelect={handleRouteSelect}
                  selectedSavedRouteId={savedRouteId}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 mt-4 pt-4 border-t border-separator">
                {savedRouteId ? (
                  // Показываем Edit и Delete когда маршрут выбран
                  <div className="flex gap-2">
                    <EditSavedRouteButton
                      savedRouteId={savedRouteId}
                      routeSectionId={sectionId}
                      onSuccess={handleRouteUpdateSuccess}
                    />
                    <DeleteSavedRouteButton
                      savedRouteId={savedRouteId}
                      onSuccess={handleRouteDeleteSuccess}
                    />
                  </div>
                ) : (
                  // Показываем Add когда маршрут не выбран
                  <AddSavedRouteButton
                    routeSectionId={sectionId}
                    onSuccess={handleRouteActionSuccess}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </InfoCard>
    </div>
  )
}
