'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation2 } from 'lucide-react'
import { Icon } from '@/shared/ui'

interface Props {
  lat: number
  lng: number
  unitNumber: string
  clickedOutside: boolean
  resetClick: () => void
}

export const TruckMarker = ({
  lat,
  lng,
  unitNumber,
  clickedOutside,
  resetClick,
}: Props) => {
  const [position, setPosition] = useState({ lat, lng })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const router = useRouter()

  // Очередь точек, которые приходят с сервера
  const pointQueue = useRef<{ lat: number; lng: number }[]>([])
  const currentPointRef = useRef<{ lat: number; lng: number } | null>(null)
  const nextPointRef = useRef<{ lat: number; lng: number } | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const duration = 1000 // 1 секунда интерполяции

  // Приход новой координаты
  useEffect(() => {
    pointQueue.current.push({ lat, lng })
  }, [lat, lng])

  // Вычисление угла между двумя точками
  const calculateRotation = (
    current: { lat: number; lng: number },
    next: { lat: number; lng: number },
  ) => {
    const deltaLng = next.lng - current.lng
    const deltaLat = next.lat - current.lat
    const angle = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI)
    return angle
  }

  useEffect(() => {
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimeRef.current) {
        if (!currentPointRef.current && pointQueue.current.length >= 1) {
          currentPointRef.current = pointQueue.current.shift()!
          nextPointRef.current = pointQueue.current.length
            ? pointQueue.current[0]
            : currentPointRef.current
          startTimeRef.current = timestamp
          // Вычисляем угол при выборе новой точки
          if (currentPointRef.current && nextPointRef.current) {
            const angle = calculateRotation(
              currentPointRef.current,
              nextPointRef.current,
            )
            setRotation(angle)
          }
        } else if (currentPointRef.current && pointQueue.current.length > 0) {
          nextPointRef.current = pointQueue.current[0]
          startTimeRef.current = timestamp
          // Вычисляем угол при выборе новой точки
          const angle = calculateRotation(
            currentPointRef.current,
            nextPointRef.current,
          )
          setRotation(angle)
        } else {
          animationFrameId = requestAnimationFrame(step)
          return
        }
      }

      if (
        currentPointRef.current &&
        nextPointRef.current &&
        startTimeRef.current
      ) {
        const progress = Math.min(
          1,
          (timestamp - startTimeRef.current) / duration,
        )

        const interpolatedLat =
          currentPointRef.current.lat +
          (nextPointRef.current.lat - currentPointRef.current.lat) * progress
        const interpolatedLng =
          currentPointRef.current.lng +
          (nextPointRef.current.lng - currentPointRef.current.lng) * progress

        setPosition({ lat: interpolatedLat, lng: interpolatedLng })

        if (progress === 1) {
          currentPointRef.current = pointQueue.current.shift() || null
          startTimeRef.current = null
          // Вычисляем угол для следующей точки, если она есть
          if (currentPointRef.current && pointQueue.current.length > 0) {
            const angle = calculateRotation(
              currentPointRef.current,
              pointQueue.current[0],
            )
            setRotation(angle)
          }
        }
      }

      animationFrameId = requestAnimationFrame(step)
    }

    animationFrameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])
  useEffect(() => {
    if (clickedOutside && isMenuOpen) {
      setIsMenuOpen(false)
      resetClick()
    }
  }, [clickedOutside, isMenuOpen, resetClick])

  const handleMarkerClick = (e: google.maps.MapMouseEvent) => {
    e.domEvent?.stopPropagation()
    setIsMenuOpen(true)
  }

  const handleMenuClick = () => {
    router.push(`/truck/${unitNumber}`)
  }

  return (
    <AdvancedMarker position={position} onClick={handleMarkerClick}>
      <div className="relative inline-block">
        <Navigation2
          className="text-white fill-red-600"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-gray-100 rounded-md px-2 py-1 text-xs font-bold text-gray-700 cursor-pointer z-10 whitespace-nowrap">
          #{unitNumber}
        </div>

        {isMenuOpen && (
          <div
            className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 bg-[hsl(210,20%,96%)] rounded-md shadow-md p-4 z-20 text-left cursor-pointer w-64"
            onClick={handleMenuClick}>
            <div className="font-bold text-lg text-[hsl(210,36%,18%)]">
              {unitNumber}
            </div>
            <div className="mt-2 text-sm text-[hsl(210,11%,60%)] whitespace-nowrap overflow-hidden text-ellipsis">
              [some address]
            </div>
            <div className="mt-2 flex items-center text-sm text-[hsl(210,11%,60%)]">
              <Icon name="common/fuel" width={17} height={17} />
              80%
            </div>
          </div>
        )}
      </div>
    </AdvancedMarker>
  )
}
