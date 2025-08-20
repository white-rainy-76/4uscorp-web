'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { AddDriverForm } from './add-driver-form'

interface AddDriverModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddDriverModal = ({ isOpen, onClose }: AddDriverModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-heading">
            Add New Driver
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3">
          <AddDriverForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
