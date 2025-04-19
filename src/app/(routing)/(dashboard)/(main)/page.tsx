'use client'
import React from 'react'
import Link from 'next/link'
import { MapWithTrucks } from '@/widgets/map'

export default function HomePage() {
  return (
    <div>
      <Link href="/truck/123">Click me</Link>
      <MapWithTrucks />
    </div>
  )
}
