import { useState, useEffect } from 'react'
import { Directions } from '@/features/directions/api'
import { useGetTollRoadsMutation, TollRoad } from '@/entities/toll-roads'

type UseRouteTollRoadsParams = {
  directionsResponseData?: Directions
}

export function useRouteTollRoads({
  directionsResponseData,
}: UseRouteTollRoadsParams) {
  const [tollRoadsData, setTollRoadsData] = useState<TollRoad[]>([])

  const { mutateAsync: getTollRoads, isPending: isTollRoadsLoading } =
    useGetTollRoadsMutation({
      onSuccess: (data) => {
        setTollRoadsData(data)
      },
      onError: (error) => {
        console.error('Get toll roads error:', error)
        setTollRoadsData([])
      },
    })

  // Когда приходит directionsResponseData (множество секций)
  useEffect(() => {
    if (
      directionsResponseData?.route &&
      directionsResponseData.route.length > 0
    ) {
      const sectionIds = directionsResponseData.route.map(
        (route) => route.routeSectionId,
      )
      if (sectionIds.length > 0) {
        getTollRoads(sectionIds)
      }
    }
  }, [directionsResponseData, getTollRoads])

  return {
    tollRoadsData,
    isTollRoadsLoading,
  }
}
