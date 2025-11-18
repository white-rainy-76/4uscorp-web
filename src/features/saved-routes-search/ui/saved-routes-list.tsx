'use client'

import React from 'react'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { MapPin } from 'lucide-react'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'

interface SavedRoutesListProps {
  routes: SavedRouteItem[]
  onRouteSelect?: (route: SavedRouteItem) => void
  selectedSavedRouteId?: string | null
}

export const SavedRoutesList = ({
  routes,
  onRouteSelect,
  selectedSavedRouteId,
}: SavedRoutesListProps) => {
  if (routes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-text-muted" />
        </div>
        <p className="text-sm font-semibold text-text-heading mb-1">
          No routes found
        </p>
        <p className="text-xs text-text-muted">
          Try searching with different locations
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-1">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onRouteSelect?.(route)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 
              ${
                selectedSavedRouteId === route.id
                  ? 'border-primary bg-accent shadow-md'
                  : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
              }`}>
            <div className="flex items-center gap-3">
              <MapPin
                className={`w-5 h-5 flex-shrink-0 ${
                  selectedSavedRouteId === route.id
                    ? 'text-primary'
                    : 'text-text-muted'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide mb-1">
                  Route ID
                </p>
                <p className="text-sm font-mono font-semibold text-text-heading break-all">
                  {route.id}
                </p>
              </div>
              {selectedSavedRouteId === route.id && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
