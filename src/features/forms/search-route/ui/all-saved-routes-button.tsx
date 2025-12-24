'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { routeQueries } from '@/entities/route/api/route.queries'
import {
  SavedRoutesModal,
  SavedRouteItem,
} from '@/features/route/saved-routes-selector'
import { useRouteFormStore } from '@/shared/store'
import { BookOpen } from 'lucide-react'

interface AllSavedRoutesButtonProps {
  onRouteSelect: (savedRouteId: string | undefined) => void
  onOriginDestinationUpdate?: (origin: string, destination: string) => void
}

export const AllSavedRoutesButton = ({
  onRouteSelect,
  onOriginDestinationUpdate,
}: AllSavedRoutesButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setOrigin, setDestination, setOriginName, setDestinationName } =
    useRouteFormStore()

  const { data: allSavedRoutes = [], isLoading } = useQuery({
    ...routeQueries.allSavedRoute(),
  })

  const handleSelectRoute = (route: SavedRouteItem) => {
    // Обновляем savedRouteId
    onRouteSelect(route.id)

    // Обновляем координаты и названия в store, если они есть
    if (
      route.startLatitude !== undefined &&
      route.startLongitude !== undefined &&
      route.endLatitude !== undefined &&
      route.endLongitude !== undefined
    ) {
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

    // Вызываем callback для обновления полей формы, если передан
    if (onOriginDestinationUpdate) {
      onOriginDestinationUpdate(
        route.startAddress || route.name || '',
        route.endAddress || route.name || '',
      )
    }

    setIsModalOpen(false)
  }

  return (
    <>
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}>
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {isLoading
              ? 'Loading...'
              : `View All Saved Routes (${allSavedRoutes.length})`}
          </span>
        </Button>
      </div>

      {/* All Saved Routes Modal */}
      <SavedRoutesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        savedRoutes={allSavedRoutes}
        onSelect={handleSelectRoute}
      />
    </>
  )
}
