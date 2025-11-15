'use client'

import { RouteSearchForm } from '@/features/forms/search-route'
import { RouteInfoEditorProps } from '../model/types'

export const RouteInfoEditor = ({
  truck,
  currentFuelPercent,
  onSubmitForm,
}: RouteInfoEditorProps) => {
  return (
    <div className="flex-1">
      <RouteSearchForm
        truck={truck}
        currentFuelPercent={currentFuelPercent}
        onSubmitForm={onSubmitForm}
      />
    </div>
  )
}
