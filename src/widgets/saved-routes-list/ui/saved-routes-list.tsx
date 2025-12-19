'use client'

import React from 'react'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { MapPin, Pencil, Check, X } from 'lucide-react'
import { SavedRouteItem } from '@/features/route/saved-routes-selector'
import { useSavedRouteInlineRename } from '@/features/route/edit-saved-route-name'

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
  const {
    inputRef,
    editingRouteId,
    draftName,
    isSaving,
    startEditing: onStartEditing,
    cancelEditing: onCancelEditing,
    setDraftName: onDraftNameChange,
    commitEditing: onCommitEditing,
  } = useSavedRouteInlineRename(routes)

  const isEditing = editingRouteId !== null

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
      <div className="space-y-3 p-1 pr-4">
        {routes.map((route) => (
          <div
            key={route.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (isEditing) return
              onRouteSelect?.(route)
            }}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 
              ${
                selectedSavedRouteId === route.id
                  ? 'border-primary bg-accent shadow-md'
                  : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
              } group cursor-pointer select-none`}>
            <div className="flex items-center gap-3">
              <MapPin
                className={`w-5 h-5 flex-shrink-0 ${
                  selectedSavedRouteId === route.id
                    ? 'text-primary'
                    : 'text-text-muted'
                }`}
              />
              <div className="flex-1 min-w-0">
                {editingRouteId === route.id ? (
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}>
                    <input
                      ref={inputRef}
                      value={draftName}
                      disabled={isSaving}
                      onChange={(e) => onDraftNameChange(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          onCommitEditing()
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          onCancelEditing()
                        }
                      }}
                      onBlur={() => {
                        // Save on blur for fast UX; buttons below use onMouseDown to prevent blur
                        onCommitEditing()
                      }}
                      placeholder="Route name"
                      className="w-full bg-transparent text-sm font-semibold text-text-heading border-b border-separator focus:outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      aria-label="Save name"
                      disabled={isSaving}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onCommitEditing()
                      }}
                      className="p-1 rounded-md hover:bg-primary/10 disabled:opacity-50">
                      <Check className="w-4 h-4 text-primary" />
                    </button>

                    <button
                      type="button"
                      aria-label="Cancel"
                      disabled={isSaving}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation()
                        onCancelEditing()
                      }}
                      className="p-1 rounded-md hover:bg-destructive/10 disabled:opacity-50">
                      <X className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                ) : route.name || route.startAddress ? (
                  <>
                    <p className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide mb-1">
                      Route Name
                    </p>
                    <p className="text-sm font-semibold text-text-heading break-all">
                      {route.name || route.startAddress}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-text-muted-alt uppercase tracking-wide mb-1">
                      Route ID
                    </p>
                    <p className="text-sm font-mono font-semibold text-text-heading break-all">
                      {route.id}
                    </p>
                  </>
                )}
              </div>

              {editingRouteId !== route.id && (
                <button
                  type="button"
                  aria-label="Rename route"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEditing(route)
                  }}
                  className={`p-2 rounded-xl transition-opacity hover:bg-primary/10 ${
                    selectedSavedRouteId === route.id
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}>
                  <Pencil className="w-4 h-4 text-text-muted" />
                </button>
              )}

              {selectedSavedRouteId === route.id && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
