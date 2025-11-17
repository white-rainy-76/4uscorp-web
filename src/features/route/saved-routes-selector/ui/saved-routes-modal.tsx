'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { SavedRouteItem } from '../types/saved-route-item'
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react'

interface SavedRoutesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  savedRoutes: SavedRouteItem[]
  onSelect: (route: SavedRouteItem) => void
}

export function SavedRoutesModal({
  open,
  onOpenChange,
  savedRoutes,
  onSelect,
}: SavedRoutesModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = () => {
    const selected = savedRoutes.find((route) => route.id === selectedId)
    if (selected) {
      onSelect(selected)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] border-border">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-text-heading font-black text-2xl flex items-center gap-2">
            <Navigation className="w-6 h-6 text-primary" />
            Saved Routes
          </DialogTitle>
          <DialogDescription className="text-text-muted-alt text-base">
            Select from {savedRoutes.length} available route
            {savedRoutes.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] pr-4 -mr-4">
          <div className="space-y-3 p-1">
            {savedRoutes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedId(route.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 
                  ${
                    selectedId === route.id
                      ? 'border-primary bg-accent shadow-md'
                      : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
                  }`}>
                <div className="flex items-start gap-3">
                  {/* Radio indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedId === route.id
                          ? 'border-primary bg-primary'
                          : 'border-separator bg-background'
                      }`}>
                      {selectedId === route.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Route details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-extrabold text-sm text-text-heading tracking-wide">
                        ROUTE #{route.id}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-neutral font-medium leading-snug truncate">
                          {route.startAddress || 'Start location'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-neutral font-medium leading-snug truncate">
                          {route.endAddress || 'End location'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t border-separator">
          <Button
            variant="outline"
            className="font-semibold text-text-heading"
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedId}
            className="font-semibold">
            Use Selected Route
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
