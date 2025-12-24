import React, { useState } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import classNames from 'classnames'
import { Toll } from '../model/types/tolls'
import { Icon } from '@/shared/ui/Icon'
import { TollPaymentType, AxelType } from '../api'
import { getTollPriceAmountWithPriority } from '@/entities/tolls/lib'

interface Props {
  toll: Toll
  selectedTolls?: Toll[]
  onTollSelect?: (toll: Toll, isSingleSelect?: boolean) => void
  onTollOpenDetails?: (toll: Toll) => void
  selectedAxelType?: AxelType
  selectedPaymentType?: TollPaymentType | null
}

export const TollMarker: React.FC<Props> = ({
  toll,
  selectedTolls = [],
  onTollSelect,
  onTollOpenDetails,
  selectedAxelType = AxelType._5L,
  selectedPaymentType = null,
}) => {
  const [hovered, setHovered] = useState(false)

  const isSelected = selectedTolls.some(
    (selectedToll) => selectedToll.id === toll.id,
  )
  const hasNoKey = !toll.key
  const hasPrices = toll.tollPrices && toll.tollPrices.length > 0
  const isEntry = !!toll.isEntry
  const isExit = !!toll.isExit
  const hasEntryOrExit = isEntry || isExit

  const displayPrice = (() => {
    // If no tollPrices exist, don't show price
    if (!toll.tollPrices || toll.tollPrices.length === 0) {
      return undefined
    }

    // Pricing model via tollPrices (supports multiple payment types + axle types)
    const { amount } = getTollPriceAmountWithPriority(
      toll.tollPrices,
      selectedAxelType,
      selectedPaymentType,
    )
    if (amount != null && amount > 0) return amount

    return undefined
  })()

  const handleMarkerClick = (e: google.maps.MapMouseEvent) => {
    e.domEvent?.stopPropagation()

    // Open details drawer if provided (primary UX for route maps)
    onTollOpenDetails?.(toll)

    if (onTollSelect) {
      // Проверяем, нажата ли клавиша Ctrl (Windows/Linux) или Cmd (Mac)
      const domEvent = e.domEvent
      const isCtrlOrCmd =
        (domEvent instanceof MouseEvent &&
          (domEvent.ctrlKey || domEvent.metaKey)) ||
        false
      onTollSelect(toll, isCtrlOrCmd)
    }
  }

  return (
    <AdvancedMarker
      position={toll.position}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleMarkerClick}
      className={classNames('toll-marker', {
        hovered,
        selected: isSelected,
      })}
      zIndex={isSelected ? 2000 : hasPrices ? 100 : 1}>
      <div className="relative flex items-center justify-center">
        {/* Множественные пульсирующие кольца для выбранного маркера */}
        {isSelected && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
            <div
              className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
            <div
              className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"
              style={{ animationDelay: '1s' }}
            />
          </>
        )}
        {/* Внешнее кольцо с градиентом для выбранного маркера */}
        {isSelected && (
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-60 blur-sm" />
        )}
        {/* Кольцо свечения */}
        <div
          className={classNames(
            'absolute -inset-1 rounded-full transition-all duration-300',
            {
              'ring-4 ring-blue-500/50 ring-offset-2 ring-offset-white shadow-xl shadow-blue-500/50':
                isSelected,
              'ring-2 ring-blue-300/30':
                hovered && !isSelected && !hasEntryOrExit,
              'ring-2 ring-green-400/40': isEntry && !isSelected && !hovered,
              'ring-3 ring-green-500/50': isEntry && !isSelected && hovered,
              'ring-2 ring-yellow-400/40': isExit && !isSelected && !hovered,
              'ring-3 ring-yellow-500/50': isExit && !isSelected && hovered,
            },
          )}
        />
        {/* Сам маркер */}
        <div
          className={classNames(
            'relative rounded-full border shadow-sm flex items-center justify-center transition-all duration-300',
            {
              'p-1.5 shadow-md border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-105':
                hovered && !isSelected && !hasNoKey && !hasEntryOrExit,
              'p-1.5 border-gray-300 bg-white':
                !hovered && !isSelected && !hasNoKey && !hasEntryOrExit,
              'p-2 border-blue-600 bg-gradient-to-br from-blue-100 via-blue-50 to-white border-[1px] shadow-2xl shadow-blue-500/40 scale-125':
                isSelected,
              'p-1.5 border-yellow-400 bg-yellow-200 shadow-md':
                hasNoKey && !isSelected,
              'p-1.5 border-yellow-500 bg-yellow-300 scale-105':
                hasNoKey && !isSelected && hovered,
              'p-1.5 border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-md':
                isEntry && !isSelected && !hasNoKey && !hovered,
              'p-1.5 border-green-600 bg-gradient-to-br from-green-100 to-green-200 scale-105 shadow-lg':
                isEntry && !isSelected && !hasNoKey && hovered,
              'p-1.5 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md':
                isExit && !isSelected && !hasNoKey && !hovered,
              'p-1.5 border-yellow-600 bg-gradient-to-br from-yellow-100 to-yellow-200 scale-105 shadow-lg':
                isExit && !isSelected && !hasNoKey && hovered,
            },
          )}>
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Icon
              name="common/dollar"
              width={16}
              height={16}
              className={classNames('transition-all duration-300', {
                'text-blue-600': !isSelected && !hovered && !hasEntryOrExit,
                'text-blue-700': isSelected,
                'text-blue-700 scale-110':
                  hovered && !isSelected && !hasEntryOrExit,
                'text-green-600': isEntry && !isSelected && !hovered,
                'text-green-700 scale-110': isEntry && !isSelected && hovered,
                'text-yellow-600': isExit && !isSelected && !hovered,
                'text-yellow-700 scale-110': isExit && !isSelected && hovered,
              })}
            />
            {displayPrice !== undefined && displayPrice !== null && (
              <span
                className={classNames(
                  'text-[10px] font-bold leading-none whitespace-nowrap',
                  {
                    'text-blue-700': isSelected,
                    'text-blue-600':
                      hovered && !isSelected && !hasNoKey && !hasEntryOrExit,
                    'text-gray-600':
                      !hovered && !isSelected && !hasNoKey && !hasEntryOrExit,
                    'text-yellow-800': hasNoKey,
                    'text-green-700': isEntry && !isSelected && !hasNoKey,
                    'text-yellow-700': isExit && !isSelected && !hasNoKey,
                  },
                )}>
                ${displayPrice.toFixed(2)}
              </span>
            )}
          </div>
          {/* Индикатор для толлов с isEntry/isExit */}
          {isEntry && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-green-500 border border-white shadow-sm whitespace-nowrap">
              Ent.
            </div>
          )}
          {isExit && (
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white bg-yellow-500 border border-white shadow-sm whitespace-nowrap">
              Ex.
            </div>
          )}
        </div>
        {/* Внутренняя тень для выбранного маркера */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-white/20 pointer-events-none" />
        )}
      </div>
    </AdvancedMarker>
  )
}
