'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { SavedRoutesCombinedPanel } from '@/features/saved-routes-search'
import { MapWithSavedRoutes, SimplifiedRoutePanel } from '@/widgets/map'
import { useHandleDirectionsMutation } from '@/features/directions/api/handle-direction.mutation'
import { useSavedRoutesStore } from '@/shared/store'
import { useGetTollsAlongPolylineSectionsMutation } from '@/features/tolls/get-tolls-along-polyline-sections'
import { useGetTollRoadsMutation } from '@/entities/roads'
import { Directions, RouteRequestPayload } from '@/features/directions'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { TollRoad } from '@/entities/roads'
import { AxelType, TollPaymentType } from '@/entities/tolls/api'
import { getAvailablePaymentTypesForAxles } from '@/entities/tolls/lib/toll-pricing'
import {
  SavedRoutesFetchRouteParams,
  SavedRoutesRouteParams,
} from '@/features/saved-routes-search/types'

export default function SavedRoutesPage() {
  const [hasSearched, setHasSearched] = useState(false)
  const [tollsData, setTollsData] = useState<TollWithSection[]>([])
  const [tollRoadsData, setTollRoadsData] = useState<TollRoad[]>([])
  const [directionsData, setDirectionsData] = useState<Directions | undefined>()
  const clearWaypointsRef = useRef<(() => void) | null>(null)
  const [selectedAxelType, setSelectedAxelType] = useState<AxelType>(
    AxelType._5L,
  )
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<TollPaymentType>(TollPaymentType.PayOnline)

  const { sectionId, setSectionId, setRouteId, setSavedRouteId } =
    useSavedRoutesStore()

  // Mutation для создания маршрута
  const { mutateAsync: directionsMutationAsync, isPending: isCreatingRoute } =
    useHandleDirectionsMutation('create')

  // Mutations для tolls и toll roads
  const { mutateAsync: getTollsAlongSections, isPending: isTollsLoading } =
    useGetTollsAlongPolylineSectionsMutation()

  const { mutateAsync: getTollRoads, isPending: isTollRoadsLoading } =
    useGetTollRoadsMutation()

  // Колбек для запроса маршрута с последующими запросами tolls и toll roads
  const handleDirectionsWithTolls = useCallback(
    async (payload: RouteRequestPayload): Promise<Directions> => {
      const result = await directionsMutationAsync(payload)

      // Обновляем directionsData
      setDirectionsData(result)

      // Обновляем store
      if (result?.route && result.route.length > 0) {
        setSectionId(result.route[0].routeSectionId)
        setRouteId(result.routeId)
      }

      // Берём tolls и toll roads по секциям
      if (result?.route && result.route.length > 0) {
        const sectionIds = result.route.map((route) => route.routeSectionId)

        // Параллельно запрашиваем tolls и toll roads
        await Promise.all([
          getTollsAlongSections(sectionIds)
            .then((tolls) => setTollsData(tolls))
            .catch((error) => {
              console.error('Get tolls error:', error)
              setTollsData([])
            }),
          getTollRoads(sectionIds)
            .then((roads) => setTollRoadsData(roads))
            .catch((error) => {
              console.error('Get toll roads error:', error)
              setTollRoadsData([])
            }),
        ])
      }

      return result
    },
    [
      directionsMutationAsync,
      getTollsAlongSections,
      getTollRoads,
      setSectionId,
      setRouteId,
    ],
  )

  // Общая логика для обработки маршрута
  const handleRouteProcessing = useCallback(
    async (
      params: SavedRoutesRouteParams | SavedRoutesFetchRouteParams,
      errorMessage: string,
      onSuccess?: () => void,
    ) => {
      // Очищаем waypoints при обработке маршрута
      clearWaypointsRef.current?.()

      try {
        // Если есть savedRouteId, передаем только его
        if ('savedRouteId' in params) {
          await handleDirectionsWithTolls({
            savedRouteId: params.savedRouteId,
          })
        } else {
          // Иначе передаем координаты для создания нового маршрута
          await handleDirectionsWithTolls({
            origin: params.origin,
            destination: params.destination,
            originName: params.originName,
            destinationName: params.destinationName,
          })
        }

        onSuccess?.()
      } catch (error) {
        console.error(errorMessage, error)
      }
    },
    [handleDirectionsWithTolls],
  )

  const handleCreateRoute = useCallback(
    async (params: SavedRoutesRouteParams) => {
      await handleRouteProcessing(params, 'Error creating route:', () => {
        // Очищаем savedRouteId после создания нового маршрута
        setSavedRouteId(null)
      })
    },
    [handleRouteProcessing, setSavedRouteId],
  )

  const handleRouteSelectAndFetch = useCallback(
    async (params: SavedRoutesFetchRouteParams) => {
      await handleRouteProcessing(params, 'Error fetching saved route:')
    },
    [handleRouteProcessing],
  )

  const handleRouteClear = useCallback(() => {
    // Очищаем все данные маршрута, tolls и toll roads после удаления или обновления
    setDirectionsData(undefined)
    setTollsData([])
    setTollRoadsData([])
    // Очищаем waypoints
    clearWaypointsRef.current?.()
    // Очищаем состояния в store
    setSectionId(null)
    setRouteId(null)
    setSavedRouteId(null)
  }, [setSectionId, setRouteId, setSavedRouteId])

  const sectionTolls = useMemo(() => {
    if (!sectionId) return []
    return tollsData.filter(
      (toll) => toll.routeSection === sectionId && !toll.isDynamic,
    )
  }, [tollsData, sectionId])

  const availablePaymentTypes = useMemo(() => {
    return getAvailablePaymentTypesForAxles(sectionTolls, selectedAxelType)
  }, [sectionTolls, selectedAxelType])

  useEffect(() => {
    if (availablePaymentTypes.length === 0) return
    if (!availablePaymentTypes.includes(selectedPaymentType)) {
      setSelectedPaymentType(availablePaymentTypes[0])
    }
  }, [availablePaymentTypes, selectedPaymentType])

  return (
    <div
      className="fixed inset-0 h-screen"
      style={{ width: 'calc(100vw - 92px)', left: '92px' }}>
      <SavedRoutesCombinedPanel
        hasSearched={hasSearched}
        onSearchComplete={() => setHasSearched(true)}
        onCreateRoute={handleCreateRoute}
        onRouteSelectAndFetch={handleRouteSelectAndFetch}
        isCreatingRoute={isCreatingRoute}
        onClearWaypoints={() => clearWaypointsRef.current?.()}
        onRouteDelete={handleRouteClear}
        onRouteUpdate={handleRouteClear}
      />

      {/* Simplified Route Panel */}
      {directionsData && (
        <SimplifiedRoutePanel
          directionsData={directionsData}
          tolls={tollsData}
          selectedAxelType={selectedAxelType}
          selectedPaymentType={selectedPaymentType}
          onAxelTypeChange={setSelectedAxelType}
          onPaymentTypeChange={setSelectedPaymentType}
        />
      )}

      <MapWithSavedRoutes
        isLoading={isCreatingRoute || isTollsLoading || isTollRoadsLoading}
        directionsData={directionsData}
        directionsMutation={handleDirectionsWithTolls}
        tolls={tollsData}
        tollRoads={tollRoadsData}
        selectedAxelType={selectedAxelType}
        selectedPaymentType={selectedPaymentType}
        onClearWaypointsCallback={(clearFn) => {
          clearWaypointsRef.current = clearFn
        }}
      />
    </div>
  )
}
