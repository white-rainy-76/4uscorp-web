'use client'

import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { GoogleMapsContext } from '@vis.gl/react-google-maps'
import type { Ref } from 'react'

type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onDrag?: (e: google.maps.MapMouseEvent) => void
  onDragStart?: (e: google.maps.MapMouseEvent) => void
  onDragEnd?: (e: google.maps.MapMouseEvent) => void
  onMouseOver?: (e: google.maps.MapMouseEvent) => void
  onMouseOut?: (e: google.maps.MapMouseEvent) => void
  onMouseMove?: (e: google.maps.MapMouseEvent) => void
}

type PolylineCustomProps = {
  path?: google.maps.LatLngLiteral[] // Массив координат маршрута
}

export type PolylineProps = google.maps.PolylineOptions &
  PolylineEventProps &
  PolylineCustomProps

export type PolylineRef = Ref<google.maps.Polyline | null>

function usePolyline(props: PolylineProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onMouseMove,
    path,
    ...polylineOptions
  } = props

  const callbacks = useRef<Record<string, (e: unknown) => void>>({})
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onMouseMove,
  })

  const polyline = useRef(new google.maps.Polyline()).current

  // Обновляем опции Polyline
  useMemo(() => {
    polyline.setOptions(polylineOptions)
  }, [polyline, polylineOptions])

  // Устанавливаем путь маршрута
  useEffect(() => {
    if (path) {
      polyline.setPath(path)
    }
  }, [path, polyline])

  const map = useContext(GoogleMapsContext)?.map

  // Добавляем Polyline на карту
  useEffect(() => {
    if (!map) {
      if (map === undefined) {
        console.error('<Polyline> has to be inside a Map component.')
      }
      return
    }

    polyline.setMap(map)

    return () => {
      polyline.setMap(null)
    }
  }, [map, polyline])

  // Привязываем обработчики событий
  useEffect(() => {
    if (!polyline) return

    const gme = google.maps.event
    ;[
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut'],
      ['mousemove', 'onMouseMove'],
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(polyline, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback]
        if (callback) callback(e)
      })
    })

    return () => {
      gme.clearInstanceListeners(polyline)
    }
  }, [polyline])

  return polyline
}

export const Polyline = forwardRef((props: PolylineProps, ref: PolylineRef) => {
  const polyline = usePolyline(props)
  useImperativeHandle(ref, () => polyline, [polyline])
  return null
})

Polyline.displayName = 'Polyline'
