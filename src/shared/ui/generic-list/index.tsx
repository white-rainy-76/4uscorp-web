'use client'

import React from 'react'

type GenericListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  isLoading?: boolean
  skeleton?: React.ReactNode
  emptyMessage?: string
}

export function GenericList<T>({
  items,
  renderItem,
  isLoading,
  skeleton,
  emptyMessage,
}: GenericListProps<T>) {
  return (
    <div className="flex-1 overflow-y-auto p-1 pr-2 custom-scroll">
      <div className="space-y-4 mb-[120px]">
        {isLoading ? (
          skeleton
        ) : items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <p className="text-center text-text-heading">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}
