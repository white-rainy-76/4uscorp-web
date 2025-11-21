'use client'

import React from 'react'
import { Button } from '@/shared/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Toll } from '@/entities/tolls'

interface DeleteTollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTolls: Toll[]
  onConfirm: () => void
  isDeleting?: boolean
}

export const DeleteTollDialog: React.FC<DeleteTollDialogProps> = ({
  open,
  onOpenChange,
  selectedTolls,
  onConfirm,
  isDeleting = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black">
            {selectedTolls.length === 1
              ? 'Delete Toll'
              : `Delete ${selectedTolls.length} Tolls`}
          </DialogTitle>
          <DialogDescription>
            {selectedTolls.length === 1 ? (
              <>
                Are you sure you want to delete &quot;{selectedTolls[0]?.name}
                &quot;? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete {selectedTolls.length} selected
                tolls? This action cannot be undone.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="text-black"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
