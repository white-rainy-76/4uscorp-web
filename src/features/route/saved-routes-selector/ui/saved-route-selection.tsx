'use client'

import { Button } from '@/shared/ui/button'
import { SavedRouteItem } from '../types/saved-route-item'
import { MapPin, Bookmark, X } from 'lucide-react'

interface SavedRouteSelectionProps {
  selectedRoute: SavedRouteItem
  onClear: () => void
  onOpenModal: () => void
}

export function SavedRouteSelection({
  selectedRoute,
  onClear,
  onOpenModal,
}: SavedRouteSelectionProps) {
  return (
    <div className="p-4 border-2 border-primary  rounded-2xl shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="w-4 h-4 text-primary fill-primary" />
            <span className="font-black text-sm text-text-heading tracking-wide uppercase">
              Using Saved Route
            </span>
          </div>

          {/* Route Details */}
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-neutral font-medium leading-snug truncate">
                {selectedRoute.startAddress || 'Start location'}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-neutral font-medium leading-snug truncate">
                {selectedRoute.endAddress || 'End location'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="font-semibold h-8 text-text-heading"
            onClick={onOpenModal}>
            Change
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 hover:bg-destructive/10 text-red-500"
            onClick={onClear}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
