import { MapControlButton } from '@/shared/ui'
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps'
import React from 'react'
import { Maximize2 } from 'lucide-react'
import { logError } from '@/shared/lib/error-handler'

interface FullScreenControllerProps {
  mapRef: React.RefObject<HTMLElement>
}

export const FullScreenController = ({ mapRef }: FullScreenControllerProps) => {
  const toggleFullscreen = () => {
    const elem = mapRef.current
    if (!elem) return

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().catch((err) => {
        logError(err as Error, {
          componentStack: 'FullScreenController - requestFullscreen',
        })
        console.error('Failed to enter fullscreen mode:', err)
      })
    } else {
      document.exitFullscreen?.().catch((err) => {
        logError(err as Error, {
          componentStack: 'FullScreenController - exitFullscreen',
        })
        console.error('Failed to exit fullscreen mode:', err)
      })
    }
  }

  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <MapControlButton
        icon={<Maximize2 size={16} />}
        onClick={toggleFullscreen}
      />
    </MapControl>
  )
}
