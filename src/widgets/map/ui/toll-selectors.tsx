'use client'

import { AxelType, TollPaymentType } from '@/entities/tolls/api'
import {
  getAvailablePaymentTypesForAxles,
  getTollPaymentTypeLabel,
} from '@/entities/tolls/lib'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'

interface TollSelectorsProps {
  tolls: TollWithSection[]
  selectedAxelType: AxelType
  selectedPaymentType: TollPaymentType
  onAxelTypeChange: (axelType: AxelType) => void
  onPaymentTypeChange: (paymentType: TollPaymentType) => void
}

export const TollSelectors = ({
  tolls,
  selectedAxelType,
  selectedPaymentType,
  onAxelTypeChange,
  onPaymentTypeChange,
}: TollSelectorsProps) => {
  const availablePaymentTypes = getAvailablePaymentTypesForAxles(
    tolls,
    selectedAxelType,
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-text-neutral/80 font-medium text-text-muted">
          Axles
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onAxelTypeChange(AxelType._5L)}
            className={
              selectedAxelType === AxelType._5L
                ? 'px-2 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white'
                : 'px-2 py-1 rounded-md text-xs font-semibold bg-muted text-text-neutral hover:bg-muted/70'
            }>
            5
          </button>
          <button
            type="button"
            onClick={() => onAxelTypeChange(AxelType._6L)}
            className={
              selectedAxelType === AxelType._6L
                ? 'px-2 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white'
                : 'px-2 py-1 rounded-md text-xs font-semibold bg-muted text-text-neutral hover:bg-muted/70'
            }>
            6
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-text-neutral/80 font-medium pt-1 text-text-muted">
          Payment Type
        </span>
        <div className="flex flex-wrap gap-1 justify-end">
          {availablePaymentTypes.length === 0 ? (
            <span className="text-xs text-text-neutral/60">-</span>
          ) : (
            availablePaymentTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onPaymentTypeChange(type)}
                className={
                  selectedPaymentType === type
                    ? 'px-2 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white'
                    : 'px-2 py-1 rounded-md text-xs font-semibold bg-muted text-text-neutral hover:bg-muted/70'
                }>
                {getTollPaymentTypeLabel(type)}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
