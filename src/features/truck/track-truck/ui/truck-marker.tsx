'use client'

import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation2 } from 'lucide-react'
import { Icon } from '@/shared/ui'
import { TruckStatsUpdate } from '@/shared/types'
import { useDictionary } from '@/shared/lib/hooks'

interface TruckMarkerProps {
  truckInfo: TruckStatsUpdate
  unitNumber: string
  clickedOutside: boolean
  resetClick: () => void
}

export const TruckMarker = ({
  truckInfo,
  unitNumber,
  clickedOutside,
  resetClick,
}: TruckMarkerProps) => {
  const [position, setPosition] = useState({
    lat: truckInfo.latitude,
    lng: truckInfo.longitude,
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const router = useRouter()
  const { lang } = useDictionary()

  const pointQueue = useRef<
    { lat: number; lng: number; headingDegrees: number }[]
  >([])

  const currentPointRef = useRef<{
    lat: number
    lng: number
    headingDegrees: number
  } | null>(null)

  const nextPointRef = useRef<{
    lat: number
    lng: number
    headingDegrees: number
  } | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const duration = 5000

  // Добавление новой точки в очередь
  useEffect(() => {
    pointQueue.current.push({
      lat: truckInfo.latitude,
      lng: truckInfo.longitude,
      headingDegrees: truckInfo.headingDegrees,
    })
  }, [truckInfo.latitude, truckInfo.longitude, truckInfo.headingDegrees])

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
        } else if (currentPointRef.current && pointQueue.current.length > 0) {
          nextPointRef.current = pointQueue.current[0]
          startTimeRef.current = timestamp
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
    router.push(`/${lang}/truck/${truckInfo.truckId}`)
  }

  return (
    <AdvancedMarker position={position} onClick={handleMarkerClick}>
      <div className="relative inline-block">
        <Navigation2
          className="text-white fill-red-600"
          style={{ transform: `rotate(${truckInfo.headingDegrees}deg)` }}
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
