import { mapOptions } from '@/shared/constants'
import { Map } from '@vis.gl/react-google-maps'
import { ReactNode } from 'react'

type MapBaseProps = {
  children?: ReactNode
}

export const MapBase = ({ children }: MapBaseProps) => {
  return (
    <Map colorScheme="LIGHT" {...mapOptions}>
      {children}
    </Map>
  )
}
