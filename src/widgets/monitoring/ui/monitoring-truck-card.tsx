'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Truck as TruckIcon } from 'lucide-react'

import type { Truck } from '@/entities/truck'
import { Badge } from '@/shared/ui/badge'
import { StatusLabel, cn } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'

type MonitoringTruckCardProps = {
  truck: Truck
  className?: string
}

export function MonitoringTruckCard({ truck, className }: MonitoringTruckCardProps) {
  const router = useRouter()
  const { lang, dictionary } = useDictionary()

  const title = truck.name ? `#${truck.name}` : dictionary.home.monitoring.truck_default_title
  const subtitle = [truck.make, truck.model, truck.year].filter(Boolean).join(' ')
  const driverName = truck.driver?.fullName ?? '—'

  const handleClick = () => {
    router.push(`/${lang}/truck/${truck.id}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/30 hover:bg-muted/50 cursor-pointer',
        className,
      )}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
        <TruckIcon className="h-6 w-6 text-text-heading" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-text-heading truncate">{title}</span>
          {truck.licensePlate ? (
            <Badge variant="outline" className="text-xs font-medium">
              {truck.licensePlate}
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm font-semibold text-text-heading truncate">
          {driverName}
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="shrink-0">
        <StatusLabel status={truck.status} />
      </div>
    </div>
  )
}
