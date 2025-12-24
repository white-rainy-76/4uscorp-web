'use client'

import { Button } from '@/shared/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Icon } from '@/shared/ui'
import { RouteInfoDisplayProps } from '../model/types'
import { ROUTE_DATE_FORMAT } from '../lib/constants'
import { getDisplayLocationName } from '../lib/helpers'
import { useDictionary } from '@/shared/lib/hooks'
import { useRouteFormStore } from '@/shared/store'

export const RouteInfoDisplay = ({ isRoute, onEdit }: RouteInfoDisplayProps) => {
  const { dictionary } = useDictionary()
  
  // Get data from store
  const { originName, destinationName, truckWeight } = useRouteFormStore()

  const displayOrigin = getDisplayLocationName(
    originName,
    dictionary.home.route.departure_city,
  )
  const displayDestination = getDisplayLocationName(
    destinationName,
    dictionary.home.route.destination_city,
  )

  const editButtonText = isRoute
    ? dictionary.home.route.adjust_route
    : dictionary.home.route.create_route
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div className="space-y-2">
        {isRoute ? (
          <>
            <div className="bg-input-bg rounded-full px-4 py-1 text-base h-[44px] text-text-neutral font-extrabold flex items-center gap-2">
              {displayOrigin} <span className="text-xl">→</span>{' '}
              {displayDestination}
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(new Date(), ROUTE_DATE_FORMAT)}
              </div>
              <div className="flex items-center gap-2">
                <Icon name="common/weight" width={16} height={16} />
                <span className="font-semibold text-black">
                  {truckWeight?.toLocaleString()} Lbt
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted rounded-full px-4 py-1 text-sm h-[44px] text-text-neutral flex items-center gap-2">
              {displayOrigin}
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(new Date(), ROUTE_DATE_FORMAT)}
              </div>
            </div>
          </>
        )}
      </div>

      <Button onClick={onEdit} className="rounded-full">
        {editButtonText}
      </Button>
    </div>
  )
}
