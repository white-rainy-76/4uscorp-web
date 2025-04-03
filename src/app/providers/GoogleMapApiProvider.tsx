'use client'
import { APIProvider } from '@vis.gl/react-google-maps'
import React from 'react'

export const GoogleMapApiProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
  return (
    <APIProvider apiKey={API_KEY} libraries={['marker']}>
      {children}
    </APIProvider>
  )
}
