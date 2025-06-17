'use client'

import { useState } from 'react'
import { InfoCard } from '@/shared/ui/info-card'
import { Button } from '@/shared/ui/button'
import { RouteSearchForm } from '@/features/search-route'
import { Coordinate } from '@/shared/types'
import { Truck } from '@/entities/truck'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface TruckRouteInfoProps {
  truck: Truck
  setOrigin: (c: Coordinate | null) => void
  setDestination: (c: Coordinate | null) => void
}

export const TruckRouteInfo = ({
  truck,
  setOrigin,
  setDestination,
}: TruckRouteInfoProps) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <RouteSearchForm setOrigin={setOrigin} setDestination={setDestination} />
    )
  }

  const isFree = true
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div className="space-y-2">
        <div className="bg-muted rounded-full px-4 py-1 text-sm">
          {isFree ? 'Las Vegas' : 'Los Angeles'}
        </div>
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          🗓️ {format(new Date(), 'yyyy/MM/dd')}
        </div>
      </div>
      <Button onClick={() => setEditing(true)} className="rounded-full">
        {isFree ? 'Создать маршрут' : 'Корректировать маршрут'}
      </Button>
    </div>
  )
}
