'use client'

import { Button } from '@/shared/ui'
import { MapIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSavedRoutesStore } from '@/shared/store'

interface CreateRouteButtonProps {
  onCreateRoute: () => void
  isLoading?: boolean
  disabled?: boolean
}

export const CreateRouteButton = ({
  onCreateRoute,
  isLoading = false,
  disabled = false,
}: CreateRouteButtonProps) => {
  const { origin, destination, originName, destinationName } =
    useSavedRoutesStore()

  const handleClick = () => {
    if (!origin || !destination) {
      toast.error('Please select origin and destination')
      return
    }

    if (!originName || !destinationName) {
      toast.error('Origin and destination names are required')
      return
    }

    onCreateRoute()
  }

  const isDisabled = disabled || isLoading || !origin || !destination

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant="outline"
      className="w-full font-semibold text-text-heading"
      size="sm">
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating Route...
        </>
      ) : (
        <>
          <MapIcon className="w-4 h-4 mr-2" />
          Create Route
        </>
      )}
    </Button>
  )
}
