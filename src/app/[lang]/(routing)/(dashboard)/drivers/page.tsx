'use client'
import React from 'react'
import { AddDriverButton } from '@/features/driver/add-driver'
import { useDictionary } from '@/shared/lib/hooks'

export default function DriverPage() {
  const { dictionary } = useDictionary()

  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-heading mb-2">
          {dictionary.home.drivers.select_driver}
        </h2>
        <p className="text-muted-foreground">
          {dictionary.home.drivers.choose_driver_message}
        </p>
      </div>
      <AddDriverButton />
    </div>
  )
}
