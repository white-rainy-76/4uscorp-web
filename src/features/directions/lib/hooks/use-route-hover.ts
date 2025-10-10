import { useState, useCallback } from 'react'

interface HoverState {
  marker: google.maps.LatLngLiteral | null
  routeSectionId: string | null
  routeIndex: number | null
}

export const useRouteHover = () => {
  const [hoverState, setHoverState] = useState<HoverState>({
    marker: null,
    routeSectionId: null,
    routeIndex: null,
  })

  /**
   * Обработка наведения на маршрут
   */
  const handleHover = useCallback(
    (
      e: google.maps.MapMouseEvent,
      routeSectionId: string,
      routeIndex: number,
    ) => {
      if (e.latLng) {
        const coordinates = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        setHoverState({
          marker: coordinates,
          routeSectionId,
          routeIndex,
        })
      }
    },
    [],
  )

  /**
   * Обработка выхода курсора с маршрута
   */
  const handleHoverOut = useCallback(() => {
    setHoverState({
      marker: null,
      routeSectionId: null,
      routeIndex: null,
    })
  }, [])

  /**
   * Очистка hover состояния
   */
  const clearHoverState = useCallback(() => {
    setHoverState({
      marker: null,
      routeSectionId: null,
      routeIndex: null,
    })
  }, [])

  return {
    hoverMarker: hoverState.marker,
    hoveredRouteSectionId: hoverState.routeSectionId,
    hoveredRouteIndex: hoverState.routeIndex,
    handleHover,
    handleHoverOut,
    clearHoverState,
  }
}
