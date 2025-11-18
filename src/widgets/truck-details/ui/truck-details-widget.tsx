'use client'

import React from 'react'
import { InfoCard } from '@/shared/ui/info-card'
import { useDictionary } from '@/shared/lib/hooks'
import { RouteList } from '@/widgets/refueling-details'
import { TruckRouteInfo } from '@/widgets/truck-route/ui'
import { MapWithRoute } from '@/widgets/map'
import { useRoute } from '@/entities/route/lib/hooks/use-route'
import { Truck } from '@/entities/truck'
import { DriverInfo, DriverInfoSkeleton } from '@/widgets/info/driver-info'
import { useRouteFormStore } from '@/shared/store'
import { useCurrentDirections } from '@/features/truck-route-management/lib/hooks/use-current-directions'
import { useCombinedGasStations } from '@/features/truck-route-management/lib/hooks/use-combined-gas-stations'
import { useSubmitRoute } from '@/features/truck-route-management/lib/hooks/use-submit-route'
import { useRouteFuelManagement } from '@/features/truck-route-management/lib/hooks/use-route-fuel-management'
import { useRouteTolls } from '@/features/truck-route-management/lib/hooks/use-route-tolls'
import { useRouteTollRoads } from '@/features/truck-route-management/lib/hooks/use-route-toll-roads'
import { useCleanupStores } from '../lib/hooks/use-cleanup-stores'

interface TruckDetailsWidgetProps {
  truckData?: Truck
  isTruckLoading: boolean
}

export function TruckDetailsWidget({
  truckData,
  isTruckLoading,
}: TruckDetailsWidgetProps) {
  const { dictionary } = useDictionary()

  const { setRouteForm } = useRouteFormStore()

  // Cleanup stores on unmount
  useCleanupStores()

  const {
    routeData,
    routeByIdData,
    isRouteLoading,
    isRouteByIdLoading,
    refetchRouteData,
  } = useRoute({
    truckId: truckData?.id,
  })

  const {
    updateGasStations,
    gasStationsData,
    isGasStationsLoading,
    handleDirectionsMutation,
    directionsResponseData,
    isDirectionsPending,
  } = useRouteFuelManagement({
    routeData,
  })

  const { tollsData, isTollsLoading } = useRouteTolls({
    routeByIdData,
    directionsResponseData,
  })

  const { tollRoadsData, isTollRoadsLoading } = useRouteTollRoads({
    directionsResponseData,
  })

  const currentDirectionsData = useCurrentDirections({
    routeByIdData,
    directionsResponseData,
  })

  const combinedGasStations = useCombinedGasStations(
    gasStationsData,
    routeByIdData,
  )

  const isLoadingRouteRelated =
    isTruckLoading ||
    isRouteLoading ||
    isRouteByIdLoading ||
    isDirectionsPending ||
    isGasStationsLoading ||
    isTollsLoading ||
    isTollRoadsLoading

  const { handleSubmitRoute } = useSubmitRoute({
    truckData,
    setRouteForm,
    handleDirectionsMutation,
  })

  return (
    <>
      <InfoCard title={dictionary.home.headings.driver_info}>
        {isTruckLoading ? (
          <DriverInfoSkeleton />
        ) : (
          truckData && <DriverInfo truck={truckData} />
        )}
      </InfoCard>

      {truckData && (
        <>
          <InfoCard title={dictionary.home.headings.driver_info}>
            {routeData && (
              <TruckRouteInfo
                truck={truckData}
                onSubmitForm={handleSubmitRoute}
                isRoute={routeData.route.isRoute}
                onRouteCompleted={refetchRouteData}
                routeByIdData={routeByIdData}
              />
            )}
          </InfoCard>
          <MapWithRoute
            truck={truckData}
            directionsData={currentDirectionsData}
            gasStations={combinedGasStations}
            routeData={routeData}
            isPending={isLoadingRouteRelated}
            mutateAsync={handleDirectionsMutation}
            updateGasStations={updateGasStations}
            tolls={tollsData}
            tollRoads={tollRoadsData}
          />
        </>
      )}
      {combinedGasStations && (
        <InfoCard title={dictionary.home.headings.details_info}>
          <RouteList gasStations={combinedGasStations} />
        </InfoCard>
      )}
    </>
  )
}
