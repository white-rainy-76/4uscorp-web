'use client'
import React from 'react'
import { useDictionary } from '@/shared/lib/hooks'

export default function TruckModelPage() {
  const { dictionary } = useDictionary()

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-heading mb-2">
          {dictionary.home.truck_models.select_truck_model}
        </h2>
        <p className="text-muted-foreground">
          {dictionary.home.truck_models.choose_truck_model_message}
        </p>
      </div>
    </div>
  )
}
