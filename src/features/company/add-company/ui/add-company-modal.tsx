'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { AddCompanyForm } from './add-company-form'

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddCompanyModal = ({ isOpen, onClose }: AddCompanyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-heading">
            Добавить компанию
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <AddCompanyForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
