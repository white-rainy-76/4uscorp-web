'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Marker } from '@vis.gl/react-google-maps'
import { Polyline } from '@/shared/ui'
import { useMap } from '@vis.gl/react-google-maps'
import { RoadEditorControls } from './road-editor-controls'

interface RoadEditorProps {
  onCancel?: () => void
  // Для редактирования существующей дороги
  initialPoints?: google.maps.LatLngLiteral[]
  onSave?: (points: google.maps.LatLngLiteral[]) => void
  // Информация о выбранной дороге
  selectedRoad?: { id: string; name: string | null } | null
  onStartEdit?: () => void
}

// Тип для точки с уникальным ID
interface PointWithId {
  id: string
  position: google.maps.LatLngLiteral
}

export const RoadEditor: React.FC<RoadEditorProps> = ({
  onCancel,
  initialPoints,
  onSave,
  selectedRoad,
  onStartEdit,
}) => {
  // Используем точки с уникальными ID для корректного удаления
  const [points, setPoints] = useState<PointWithId[]>([])
  const [originalPoints, setOriginalPoints] = useState<PointWithId[]>([]) // Для Reset
  const [isEditing, setIsEditing] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false) // Режим редактирования существующей дороги
  const map = useMap()
  const contextMenuListenerRef = useRef<google.maps.MapsEventListener | null>(
    null,
  )
  const nextPointIdRef = useRef(0)

  // Инициализация при изменении initialPoints
  useEffect(() => {
    if (initialPoints && initialPoints.length > 0) {
      const pointsWithId = initialPoints.map((point, index) => ({
        id: `point-${nextPointIdRef.current++}`,
        position: point,
      }))
      setPoints(pointsWithId)
      setOriginalPoints(JSON.parse(JSON.stringify(pointsWithId))) // Глубокая копия
      setIsEditMode(true)
      setIsEditing(true) // Автоматически запускаем редактирование
    } else {
      setPoints([])
      setOriginalPoints([])
      setIsEditMode(false)
      setIsEditing(false)
    }
  }, [initialPoints])

  // Обработчик правого клика на карте
  useEffect(() => {
    if (!map || !isEditing) {
      return
    }

    const handleContextMenu = (e: google.maps.MapMouseEvent) => {
      // Предотвращаем стандартное контекстное меню браузера
      e.domEvent?.preventDefault()

      if (e.latLng) {
        const newPoint: PointWithId = {
          id: `point-${nextPointIdRef.current++}`,
          position: {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          },
        }
        setPoints((prev) => [...prev, newPoint])
      }
    }

    // Добавляем обработчик правого клика
    contextMenuListenerRef.current = google.maps.event.addListener(
      map,
      'rightclick',
      handleContextMenu,
    )

    return () => {
      if (contextMenuListenerRef.current) {
        google.maps.event.removeListener(contextMenuListenerRef.current)
        contextMenuListenerRef.current = null
      }
    }
  }, [map, isEditing])

  // Обработчик перетаскивания маркера
  const handleMarkerDragEnd = useCallback(
    (pointId: string, e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition: google.maps.LatLngLiteral = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        }
        setPoints((prev) =>
          prev.map((point) =>
            point.id === pointId ? { ...point, position: newPosition } : point,
          ),
        )
      }
    },
    [],
  )

  // Обработчик удаления точки (по правому клику на маркер)
  const handleMarkerRightClick = useCallback((pointId: string) => {
    setPoints((prev) => prev.filter((point) => point.id !== pointId))
  }, [])

  // Начать редактирование
  const handleStartEditing = useCallback(() => {
    setIsEditing(true)
  }, [])

  // Отмена редактирования
  const handleCancel = useCallback(() => {
    if (isEditMode) {
      // В режиме редактирования возвращаем исходное состояние
      setPoints(JSON.parse(JSON.stringify(originalPoints)))
    } else {
      setPoints([])
    }
    setIsEditing(false)
    onCancel?.()
  }, [onCancel, isEditMode, originalPoints])

  // Сброс точек
  const handleReset = useCallback(() => {
    if (isEditMode && originalPoints.length > 0) {
      // В режиме редактирования возвращаем исходное состояние
      setPoints(JSON.parse(JSON.stringify(originalPoints)))
    } else {
      setPoints([])
    }
  }, [isEditMode, originalPoints])

  // Сохранить
  const handleSave = useCallback(() => {
    if (points.length < 2) {
      alert('Необходимо добавить минимум 2 точки для создания дороги')
      return
    }
    const positions = points.map((p) => p.position)
    onSave?.(positions)
    // После сохранения обновляем originalPoints
    setOriginalPoints(JSON.parse(JSON.stringify(points)))
  }, [points, onSave])

  return (
    <>
      {/* Панель управления */}
      <RoadEditorControls
        isEditing={isEditing}
        isEditMode={isEditMode}
        pointsCount={points.length}
        selectedRoad={selectedRoad}
        onStartEditing={handleStartEditing}
        onStartEdit={onStartEdit}
        onCancel={handleCancel}
        onReset={handleReset}
        onSave={handleSave}
      />

      {/* Отображение полилинии и маркеров только в режиме редактирования */}
      {isEditing && (
        <>
          {/* Полилиния, соединяющая точки */}
          {points.length >= 2 && (
            <Polyline
              path={points.map((p) => p.position)}
              strokeColor="#FF6B6B"
              strokeOpacity={0.8}
              strokeWeight={4}
              zIndex={10}
            />
          )}

          {/* Маркеры для каждой точки */}
          {points.map((point, index) => (
            <RoadPointMarker
              key={point.id}
              position={point.position}
              pointId={point.id}
              index={index}
              onDragEnd={(e) => handleMarkerDragEnd(point.id, e)}
              onClick={() => handleMarkerRightClick(point.id)}
            />
          ))}
        </>
      )}
    </>
  )
}

// Отдельный компонент для маркера точки с поддержкой клика для удаления
interface RoadPointMarkerProps {
  position: google.maps.LatLngLiteral
  pointId: string
  index: number
  onDragEnd: (e: google.maps.MapMouseEvent) => void
  onClick: () => void
}

const RoadPointMarker: React.FC<RoadPointMarkerProps> = ({
  position,
  pointId,
  index,
  onDragEnd,
  onClick,
}) => {
  return (
    <Marker
      position={position}
      draggable
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.domEvent?.stopPropagation()
        onClick()
      }}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FF6B6B',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#FFFFFF',
      }}
      label={{
        text: String(index + 1),
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
      }}
    />
  )
}
