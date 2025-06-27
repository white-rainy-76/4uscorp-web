'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DriverInfo } from '@/widgets/driver-info'
import { InfoCard } from '@/shared/ui/info-card'
import { useDictionary } from '@/shared/lib/hooks'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Coordinate, TruckFuelUpdate } from '@/shared/types'
import { truckQueries } from '@/entities/truck/api'
import { DriverInfoSkeleton } from '@/widgets/driver-info/ui/driver-info.skeleton'
import { RouteList } from '@/widgets/refueling-details'
import { TruckRouteInfo } from '@/widgets/truck-route/ui'
import { useGetDirectionsMutation } from '@/features/directions/api/get-direction.mutation'
import { MapWithRoute } from '@/widgets/map'
import { useUpdateGasStationsMutation } from '@/entities/gas-station/api/update-gas-station.mutation'
import { useConnection } from '@/shared/lib/context'

export default function TruckInfo() {
  const { dictionary } = useDictionary()
  const params = useParams()
  const router = useRouter()
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [origin, setOrigin] = useState<Coordinate | null>(null)
  const [destination, setDestination] = useState<Coordinate | null>(null)
  const [finishFuel, setFinishFuel] = useState<number | undefined>()
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
  //! Delete trash
  const { connection, isConnected } = useConnection()
  const [fuel, setFuel] = useState<TruckFuelUpdate | null>(null)
  const [isLoadingFuel, setIsLoadingFuel] = useState(true)
  useEffect(() => {
    if (!connection || !isConnected) return

    setIsLoadingFuel(true)

    const handleFuelUpdate = (data: TruckFuelUpdate) => {
      if (truckData && data.truckId === truckData.id) {
        setFuel(data)
        setIsLoadingFuel(false)
      }
    }

    connection.on('ReceiveTruckFuelUpdate', handleFuelUpdate)

    return () => {
      connection.off('ReceiveTruckFuelUpdate', handleFuelUpdate)
    }
  }, [connection, isConnected, truckData])

  //!!
  const {
    mutateAsync: updateGasStations,
    data: gasStationsData,
    isPending: isGasStationsLoading,
  } = useUpdateGasStationsMutation({
    onError: (error) => {
      console.error('Directions mutation error:', error)
    },
  })
  const {
    mutateAsync: getDirections,
    data: routeData,
    isPending: isRouteLoading,
    reset: resetRoute,
  } = useGetDirectionsMutation({
    onSuccess: (data) => {
      if (data?.routeId) {
        updateGasStations({
          routeId: data.routeId,
          routeSectionIds: data.route.map(
            (routeDto) => routeDto.routeSectionId,
          ),
          FinishFuel: finishFuel,
          FuelProviderNameList: selectedProviders,
          CurrentFuel: fuel?.fuelPercentage.toString(),
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
  })

  const handleRouteClick = (routeIndex: number) => {
    if (routeData?.route && routeData.route[routeIndex]) {
      setSelectedRouteId(routeData.route[routeIndex].routeSectionId)
    }
  }

  useEffect(() => {
    if (!truckId || (isTruckError && !isTruckLoading)) {
      router.replace('/404')
    }
  }, [truckId, isTruckError, isTruckLoading, router])

  useEffect(() => {
    if (!truckData) return

    const hasBothPoints = origin && destination
    hasBothPoints ? getDirections({ origin, destination }) : resetRoute()
  }, [origin, destination, truckData, getDirections, resetRoute])

  useEffect(() => {
    if (routeData?.route && routeData.route.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routeData.route[0].routeSectionId)
    }
  }, [routeData, selectedRouteId])

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
                fuel={fuel}
                isLoadingFuel={isLoadingFuel}
              />
            )
          )}
        </InfoCard>

        {truckData && (
          <>
            <InfoCard title={dictionary.home.headings.driver_info}>
              <TruckRouteInfo
                truck={truckData}
                setOrigin={setOrigin}
                setDestination={setDestination}
                setFinishFuel={setFinishFuel}
              />
            </InfoCard>
            <MapWithRoute
              origin={origin}
              destination={destination}
              routeData={routeData}
              getGasStationsResponseData={gasStationsData}
              isRoutePending={isRouteLoading}
              isGasStationsPending={isGasStationsLoading}
              mutateAsync={getDirections}
              truck={truckData}
              updateGasStations={updateGasStations}
              selectedRouteId={selectedRouteId}
              handleRouteClick={handleRouteClick}
              finishFuel={finishFuel}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              fuel={fuel?.fuelPercentage}
            />
          </>
        )}
        {gasStationsData && (
          <InfoCard title={dictionary.home.headings.details_info}>
            <RouteList
              gasStations={gasStationsData.fuelStations}
              selectedRouteId={selectedRouteId}
            />
          </InfoCard>
        )}
      </>
    )
  )
}
