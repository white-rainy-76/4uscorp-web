'use client'

import { mapOptions } from '@/shared/constants'
import { Map } from '@vis.gl/react-google-maps'
import { ReactNode } from 'react'

type MapBaseProps = {
  children?: ReactNode
  onMapClick?: () => void
}

export const MapBase = ({ children, onMapClick }: MapBaseProps) => {
  return (
    <Map
      colorScheme="LIGHT"
      {...mapOptions}
      style={{ width: '100%', height: '100%' }}
      onClick={onMapClick}>
      {children}
    </Map>
  )
}
