'use client'

import { MapControlButton } from '@/shared/ui'
import { ControlPosition, MapControl, useMap } from '@vis.gl/react-google-maps'
import { Plus, Minus } from 'lucide-react'

export const ZoomControl = () => {
  const map = useMap()

  const handleZoomIn = () => {
    const zoom = map?.getZoom?.()
    if (zoom) map?.setZoom(zoom + 1)
  }

  const handleZoomOut = () => {
    const zoom = map?.getZoom?.()
    if (zoom) map?.setZoom(zoom - 1)
  }

  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="flex flex-col space-y-2">
        <MapControlButton icon={<Plus size={16} />} onClick={handleZoomIn} />
        <MapControlButton icon={<Minus size={16} />} onClick={handleZoomOut} />
      </div>
    </MapControl>
  )
}
