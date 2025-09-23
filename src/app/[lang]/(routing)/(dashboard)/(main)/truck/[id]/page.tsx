'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { InfoCard } from '@/shared/ui/info-card'
import { useDictionary } from '@/shared/lib/hooks'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Coordinate } from '@/shared/types'
import { truckQueries } from '@/entities/truck/api'

import { RouteList } from '@/widgets/refueling-details'
import { TruckRouteInfo } from '@/widgets/truck-route/ui'
import { useHandleDirectionsMutation } from '@/features/directions/api/handle-direction.mutation'
import { MapWithRoute } from '@/widgets/map'
import { useGetGasStationsMutation } from '@/entities/gas-station/api/get-gas-station.mutation'
import { useConnection } from '@/shared/lib/context'
import { useRoute } from '@/entities/route/lib/hooks/use-route'

import { Directions, RouteRequestPayload } from '@/features/directions/api'
import { GasStation } from '@/entities/gas-station'
import { useTruckStats } from '@/entities/truck/lib'
import { DriverInfo, DriverInfoSkeleton } from '@/widgets/info/driver-info'

export default function TruckInfo() {
  const { dictionary } = useDictionary()
  const params = useParams()
  const router = useRouter()
  const { isConnected } = useConnection()

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<Coordinate | null>(null)
  const [destination, setDestination] = useState<Coordinate | null>(null)
  const [originName, setOriginName] = useState<string | undefined>()
  const [destinationName, setDestinationName] = useState<string | undefined>()
  const [finishFuel, setFinishFuel] = useState<number | undefined>()
  const [truckWeight, setTruckWeight] = useState<number | undefined>()
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])

  const truckId = useMemo(() => {
    const truckIdParam = params?.id
    return typeof truckIdParam === 'string' ? truckIdParam : undefined
  }, [params?.id])

  const {
    data: truckData,
    isLoading: isTruckLoading,
    isError: isTruckError,
  } = useQuery({
    ...truckQueries.truck(truckId!),
    enabled: !!truckId,
  })

  const { stats, isLoading } = useTruckStats(truckId, isConnected)

  const {
    routeData,
    isRouteLoading,
    isRouteByIdLoading,
    routeByIdData,
    apiOrigin,
    apiDestination,
  } = useRoute({
    truckId: truckData?.id,
    setOrigin,
    setDestination,
    setFinishFuel,
    setTruckWeight,
    setOriginName,
    setDestinationName,
  })

  const {
    mutateAsync: updateGasStations,
    data: gasStationsData,
    isPending: isGasStationsLoading,
  } = useGetGasStationsMutation({
    onError: (error) => {
      console.error('Update gas stations mutation error:', error)
    },
  })

  const {
    mutateAsync: handleDirectionsMutation,
    data: directionsResponseData,
    isPending: isDirectionsPending,
  } = useHandleDirectionsMutation(
    routeData?.route?.isRoute ? 'edit' : 'create',
    {
      onSuccess: (data) => {
        if (data?.routeId) {
          updateGasStations({
            routeId: data.routeId,
            routeSectionIds: data.route.map(
              (routeDto) => routeDto.routeSectionId,
            ),
            FinishFuel: finishFuel,
            ...(truckWeight !== undefined &&
              truckWeight !== 0 && { Weight: truckWeight }),
            FuelProviderNameList: selectedProviders,
            CurrentFuel: stats?.fuelPercentage?.toString(),
          })
        } else {
          console.warn(
            'Missing data for updateGasStations after directions fetch.',
          )
        }
      },
      onError: (error) => {
        console.error('Directions mutation error:', error)
      },
    },
  )

  const latLngToCoordinatePair = (point: Coordinate): [number, number] => {
    return [point.latitude, point.longitude]
  }

  const currentDirectionsData = useMemo<Directions | undefined>(() => {
    if (routeByIdData && !directionsResponseData) {
      return {
        routeId: routeByIdData.routeId,
        route: [
          {
            routeSectionId: routeByIdData.sectionId,

            mapPoints: routeByIdData.mapPoints.map(latLngToCoordinatePair),

            routeInfo: routeByIdData.routeInfo,
          },
        ],

        gasStations: routeByIdData.fuelStations,
      }
    }

    return directionsResponseData
  }, [routeByIdData, directionsResponseData])

  const combinedGasStations = useMemo<GasStation[] | undefined>(() => {
    if (gasStationsData?.fuelStations) {
      return gasStationsData.fuelStations
    }

    if (currentDirectionsData?.gasStations) {
      return currentDirectionsData.gasStations
    }

    return
  }, [gasStationsData, currentDirectionsData])

  const handleRouteClick = (routeIndex: number) => {
    if (
      currentDirectionsData?.route &&
      currentDirectionsData.route[routeIndex]
    ) {
      setSelectedRouteId(currentDirectionsData.route[routeIndex].routeSectionId)
    }
  }

  useEffect(() => {
    if (
      currentDirectionsData?.route &&
      currentDirectionsData.route.length > 0 &&
      !selectedRouteId
    ) {
      setSelectedRouteId(currentDirectionsData.route[0].routeSectionId)
    }
  }, [currentDirectionsData, selectedRouteId])

  useEffect(() => {
    if (!truckId || (isTruckError && !isTruckLoading)) {
      router.replace('/404')
    }
  }, [truckId, isTruckError, isTruckLoading, router])

  const isLoadingRouteRelated =
    isTruckLoading ||
    isRouteLoading ||
    isRouteByIdLoading ||
    isDirectionsPending ||
    isGasStationsLoading

  const handleSubmitRoute = (formPayload: {
    origin: Coordinate
    destination: Coordinate
    originName: string
    destinationName: string
    truckWeight?: number
    finishFuel?: number
  }) => {
    if (!truckData) {
      console.error('Truck data is not available for route submission.')
      return
    }

    setOrigin(formPayload.origin)
    setDestination(formPayload.destination)
    setOriginName(formPayload.originName)
    setDestinationName(formPayload.destinationName)
    setTruckWeight(formPayload.truckWeight)
    setFinishFuel(formPayload.finishFuel)

    const payload: RouteRequestPayload = {
      origin: formPayload.origin,
      destination: formPayload.destination,
      TruckId: truckData.id,
      originName: formPayload.originName,
      destinationName: formPayload.destinationName,
    }

    handleDirectionsMutation(payload)
  }

  return (
    truckId && (
      <>
        <InfoCard title={dictionary.home.headings.driver_info}>
          {isTruckLoading ? (
            <DriverInfoSkeleton />
          ) : (
            truckData && (
              <DriverInfo
                truck={truckData}
                truckInfo={stats}
                isLoadingFuel={false}
              />
            )
          )}
        </InfoCard>

        {truckData && (
          <>
            <InfoCard title={dictionary.home.headings.driver_info}>
              {routeData && (
                <TruckRouteInfo
                  truck={truckData}
                  origin={apiOrigin || null}
                  destination={apiDestination || null}
                  originName={originName}
                  destinationName={destinationName}
                  truckWeight={truckWeight}
                  finishFuel={finishFuel}
                  currentFuelPercent={
                    stats?.fuelPercentage
                      ? parseFloat(stats.fuelPercentage)
                      : undefined
                  }
                  onSubmitForm={handleSubmitRoute}
                  isRoute={routeData.route.isRoute}
                  routeId={
                    routeData.route.routeId
                      ? routeData.route.routeId
                      : currentDirectionsData?.routeId
                  }
                  selectedRouteId={selectedRouteId}
                />
              )}
            </InfoCard>
            <MapWithRoute
              origin={origin}
              destination={destination}
              originName={originName}
              destinationName={destinationName}
              directionsData={currentDirectionsData}
              gasStations={combinedGasStations}
              remainingFuelLiters={
                gasStationsData?.fuelRouteInfoDtos?.[0]?.finishInfo
                  ?.remainingFuelLiters
                  ? gasStationsData?.fuelRouteInfoDtos[0].finishInfo
                      .remainingFuelLiters
                  : routeByIdData?.remainingFuel
              }
              isDirectionsPending={isLoadingRouteRelated}
              isGasStationsPending={isGasStationsLoading}
              isRoutePending={isLoadingRouteRelated}
              mutateAsync={handleDirectionsMutation}
              truck={truckData}
              truckWeight={truckWeight}
              updateGasStations={updateGasStations}
              selectedRouteId={selectedRouteId}
              handleRouteClick={handleRouteClick}
              fuelRouteInfoDtos={gasStationsData?.fuelRouteInfoDtos}
              finishFuel={finishFuel}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              fuel={stats?.fuelPercentage}
              routeData={routeData}
              routeByIdTotalFuelAmount={routeByIdData?.totalFuelAmmount}
              routeByIdTotalPriceAmount={routeByIdData?.totalPriceAmmount}
            />
          </>
        )}
        {combinedGasStations && (
          <InfoCard title={dictionary.home.headings.details_info}>
            <RouteList
              gasStations={combinedGasStations}
              selectedRouteId={selectedRouteId}
              routeId={
                routeData?.route?.routeId
                  ? routeData.route.routeId
                  : currentDirectionsData?.routeId
              }
            />
          </InfoCard>
        )}
      </>
    )
  )
}
