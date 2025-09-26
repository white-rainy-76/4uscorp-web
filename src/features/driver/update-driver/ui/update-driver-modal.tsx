'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { UpdateDriverForm } from './update-driver-form'
import { Driver } from '@/entities/driver'

interface UpdateDriverModalProps {
  isOpen: boolean
  onClose: () => void
  driver?: Driver
}

export const UpdateDriverModal = ({
  isOpen,
  onClose,
  driver,
}: UpdateDriverModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-heading">
            Edit Driver
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <UpdateDriverForm onClose={onClose} driver={driver} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
