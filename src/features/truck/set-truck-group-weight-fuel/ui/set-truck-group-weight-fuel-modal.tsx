'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { SetTruckGroupWeightFuelForm } from './set-truck-group-weight-fuel-form'
import { TruckGroup } from '@/entities/truck'

interface SetTruckGroupWeightFuelModalProps {
  isOpen: boolean
  onClose: () => void
  truckGroup?: TruckGroup
}

export const SetTruckGroupWeightFuelModal = ({
  isOpen,
  onClose,
  truckGroup,
}: SetTruckGroupWeightFuelModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-heading">
            Редактировать модель трака
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <SetTruckGroupWeightFuelForm
            onClose={onClose}
            truckGroup={truckGroup}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
