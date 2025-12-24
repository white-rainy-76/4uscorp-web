'use client'

import { InfoCard } from '@/shared/ui/info-card'
import { useDictionary } from '@/shared/lib/hooks'
import { RouteList } from '@/widgets/refueling-details'
import { TruckRouteInfo } from '@/widgets/truck-route/ui'
import { MapWithRoute } from '@/widgets/map'
import { useAttachedRoute } from '@/entities/route/lib/hooks/use-route'
import { Truck } from '@/entities/truck'
import { DriverInfo, DriverInfoSkeleton } from '@/widgets/info/driver-info'
import { useRouteFormStore } from '@/shared/store'
import { useCurrentDirections } from '@/features/directions/lib/hooks'
import {
  useCombinedGasStations,
  useRouteFuelManagement,
} from '@/entities/gas-station/lib/hooks'
import { useSubmitRoute } from '@/features/route/submit-route'
import { useRouteTolls } from '@/features/tolls/lib/hooks'
import { useRouteTollRoads } from '@/features/toll-roads/lib/hooks'
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
  // Hook to get assigned to truck route data
  const {
    routeData,
    routeByIdData,
    isRouteLoading,
    isRouteByIdLoading,
    refetchRouteData,
  } = useAttachedRoute({
    truckId: truckData?.id,
  })
  // Hook to get gas stations data and directions data
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
  // Hook to get tolls along route
  const { tollsData, isTollsLoading } = useRouteTolls({
    routeByIdData,
    directionsResponseData,
  })
  // Hook to get toll roads data
  const { tollRoadsData, isTollRoadsLoading } = useRouteTollRoads({
    directionsResponseData,
  })
  // Hook to get either routeByIdData or directionsResponseData
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
