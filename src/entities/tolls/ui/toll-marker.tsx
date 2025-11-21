import React, { useState } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import classNames from 'classnames'
import { Toll } from '../model/types/tolls'
import { Icon } from '@/shared/ui/Icon'

interface Props {
  toll: Toll
  selectedTolls?: Toll[]
  onTollSelect?: (toll: Toll, isSingleSelect?: boolean) => void
}

export const TollMarker: React.FC<Props> = ({
  toll,
  selectedTolls = [],
  onTollSelect,
}) => {
  const [hovered, setHovered] = useState(false)

  const isSelected = selectedTolls.some(
    (selectedToll) => selectedToll.id === toll.id,
  )
  const hasNoKey = !toll.key

  const handleMarkerClick = (e: google.maps.MapMouseEvent) => {
    e.domEvent?.stopPropagation()
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
      zIndex={isSelected ? 2000 : 1}>
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
              'ring-2 ring-blue-300/30': hovered && !isSelected,
            },
          )}
        />
        {/* Сам маркер */}
        <div
          className={classNames(
            'relative rounded-full border shadow-sm flex items-center justify-center transition-all duration-300',
            {
              'p-1.5 shadow-md border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-105':
                hovered && !isSelected && !hasNoKey,
              'p-1.5 border-gray-300 bg-white':
                !hovered && !isSelected && !hasNoKey,
              'p-2 border-blue-600 bg-gradient-to-br from-blue-100 via-blue-50 to-white border-[1px] shadow-2xl shadow-blue-500/40 scale-125':
                isSelected,
              'p-1.5 border-yellow-400 bg-yellow-200 shadow-md':
                hasNoKey && !isSelected,
              'p-1.5 border-yellow-500 bg-yellow-300 scale-105':
                hasNoKey && !isSelected && hovered,
            },
          )}>
          <div className="flex flex-col items-center justify-center gap-0.5">
            <Icon
              name="common/dollar"
              width={16}
              height={16}
              className={classNames('transition-all duration-300', {
                'text-blue-600': !isSelected && !hovered,
                'text-blue-700': isSelected,
                'text-blue-700 scale-110': hovered && !isSelected,
              })}
            />
            {toll.payOnline !== undefined && (
              <span
                className={classNames(
                  'text-[10px] font-bold leading-none whitespace-nowrap',
                  {
                    'text-blue-700': isSelected,
                    'text-blue-600': hovered && !isSelected && !hasNoKey,
                    'text-gray-600': !hovered && !isSelected && !hasNoKey,
                    'text-yellow-800': hasNoKey,
                  },
                )}>
                ${toll.payOnline.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {/* Внутренняя тень для выбранного маркера */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-white/20 pointer-events-none" />
        )}
      </div>
    </AdvancedMarker>
  )
}
