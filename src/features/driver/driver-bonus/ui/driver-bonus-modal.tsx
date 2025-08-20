'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

import { Driver } from '@/entities/driver'
import { DriverBonusForm } from './driver-bonus-form'

interface DriverBonusModalProps {
  isOpen: boolean
  onClose: () => void
  driver?: Driver
  actionType: 'increase' | 'decrease'
}

export const DriverBonusModal = ({
  isOpen,
  onClose,
  driver,
  actionType,
}: DriverBonusModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-heading">
            {actionType === 'increase' ? 'Добавить бонусы' : 'Убавить бонусы'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <DriverBonusForm
            onClose={onClose}
            driver={driver}
            actionType={actionType}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
