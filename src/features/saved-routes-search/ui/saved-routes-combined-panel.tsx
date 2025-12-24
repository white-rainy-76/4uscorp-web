'use client'

import { useQuery } from '@tanstack/react-query'
import { InfoCard } from '@/shared/ui'
import { SavedRoutesSearchForm } from './saved-routes-search-form'
import { SavedRoutesFetchRouteParams, SavedRoutesRouteParams } from '../types'
import { SavedRoutesList } from '@/widgets/saved-routes-list'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'
import { AddSavedRouteButton } from '@/features/route/add-saved-route'
import { EditSavedRouteButton } from '@/features/route/edit-saved-route'
import { DeleteSavedRouteButton } from '@/features/route/delete-saved-route'
import { useSavedRoutesStore } from '@/shared/store'
import { routeQueries } from '@/entities/route/api/route.queries'

interface SavedRoutesCombinedPanelProps {
  hasSearched?: boolean
  onSearchComplete?: () => void
  onCreateRoute?: (params: SavedRoutesRouteParams) => void
  onRouteSelectAndFetch?: (params: SavedRoutesFetchRouteParams) => void
  isCreatingRoute?: boolean
  onClearWaypoints?: () => void
  onRouteDelete?: () => void
  onRouteUpdate?: () => void
}

export const SavedRoutesCombinedPanel = ({
  hasSearched = false,
  onSearchComplete,
  onCreateRoute,
  onRouteSelectAndFetch,
  isCreatingRoute = false,
  onClearWaypoints,
  onRouteDelete,
  onRouteUpdate,
}: SavedRoutesCombinedPanelProps) => {
  const { origin, destination, sectionId, savedRouteId, setSavedRouteId } =
    useSavedRoutesStore()

  // Query для получения всех сохранённых маршрутов (по умолчанию)
  const { data: allSavedRoutes = [], isLoading: isLoadingAllRoutes } = useQuery(
    {
      ...routeQueries.allSavedRoute(),
    },
  )

  // Query для получения сохранённых маршрутов по координатам (после поиска)
  const { data: searchedSavedRoutes = [], isLoading: isLoadingSearched } =
    useQuery({
      ...routeQueries.savedRoutes({
        startLatitude: origin?.latitude ?? 0,
        startLongitude: origin?.longitude ?? 0,
        endLatitude: destination?.latitude ?? 0,
        endLongitude: destination?.longitude ?? 0,
      }),
      enabled: hasSearched && origin !== null && destination !== null,
    })

  // Используем результаты поиска если есть поиск, иначе все маршруты
  const savedRoutes = hasSearched ? searchedSavedRoutes : allSavedRoutes
  const isLoading = hasSearched ? isLoadingSearched : isLoadingAllRoutes

  const handleRouteSelect = (route: SavedRouteItem) => {
    setSavedRouteId(route.id)

    // Если есть координаты в маршруте (из GetAllSavedRoute), устанавливаем их в store для UI
    if (
      route.startLatitude !== undefined &&
      route.startLongitude !== undefined &&
      route.endLatitude !== undefined &&
      route.endLongitude !== undefined
    ) {
      const { setOrigin, setDestination, setOriginName, setDestinationName } =
        useSavedRoutesStore.getState()

      setOrigin({
        latitude: route.startLatitude,
        longitude: route.startLongitude,
      })
      setDestination({
        latitude: route.endLatitude,
        longitude: route.endLongitude,
      })
      setOriginName(route.startAddress || route.name || '')
      setDestinationName(route.endAddress || route.name || '')
    }

    // Передаем только savedRouteId, directionsMutationAsync сам получит данные маршрута
    onRouteSelectAndFetch?.({
      savedRouteId: route.id,
    })
  }

  const handleRouteActionSuccess = () => {
    // При сохранении маршрута ничего не очищаем - данные остаются как есть
    setSavedRouteId(null)
  }

  const handleRouteUpdateSuccess = () => {
    // При обновлении ничего не очищаем - данные остаются как есть
    // При следующем клике на маршрут данные загрузятся заново
    onRouteUpdate?.()
  }

  const handleRouteDeleteSuccess = () => {
    // Очищаем все данные маршрута при удалении
    onRouteDelete?.()
  }

  return (
    <div className={`absolute top-4 right-4 bottom-4 z-10 w-[420px]`}>
      <InfoCard
        title="Saved Routes Search"
        className="shadow-xl border border-border bg-card/95 backdrop-blur-sm h-full flex flex-col overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Search Form */}
          <div className="flex-shrink-0">
            <SavedRoutesSearchForm
              isLoading={isLoading}
              onSearchComplete={onSearchComplete}
              onCreateRoute={onCreateRoute}
              isCreatingRoute={isCreatingRoute}
            />
          </div>

          {/* Divider and Results List - показываем всегда если есть маршруты или был поиск */}
          {(hasSearched || savedRoutes.length > 0) && (
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
              {(hasSearched || savedRouteId) && (
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
                    // Показываем Add когда маршрут не выбран (только после поиска)
                    hasSearched && (
                      <AddSavedRouteButton
                        routeSectionId={sectionId}
                        onSuccess={handleRouteActionSuccess}
                      />
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </InfoCard>
    </div>
  )
}
