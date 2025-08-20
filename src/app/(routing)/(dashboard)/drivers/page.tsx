'use client'
import React from 'react'
import { AddDriverButton } from '@/features/driver/add-driver'

export default function DriverPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-heading mb-2">
          Select a Driver
        </h2>
        <p className="text-muted-foreground">
          Choose a driver from the list to view details
        </p>
      </div>
      <AddDriverButton />
    </div>
  )
}
