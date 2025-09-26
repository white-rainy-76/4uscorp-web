'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { AttachDetachDriverForm } from './attach-detach-driver-form'
import { Driver } from '@/entities/driver'
import { useDictionary } from '@/shared/lib/hooks'

interface AttachDetachDriverModalProps {
  isOpen: boolean
  onClose: () => void
  driver?: Driver
}

export const AttachDetachDriverModal = ({
  isOpen,
  onClose,
  driver,
}: AttachDetachDriverModalProps) => {
  const { dictionary } = useDictionary()
  const isAttached = !!driver?.truck?.id
  const title = isAttached
    ? dictionary.home.modals.detach_driver_from_truck
    : dictionary.home.modals.attach_driver_to_truck

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-heading">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <AttachDetachDriverForm onClose={onClose} driver={driver} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
