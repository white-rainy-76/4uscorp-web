import React, { useState } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import classNames from 'classnames'
import { Toll } from '../model/types/tolls'
import { Icon } from '@/shared/ui/Icon'

interface Props {
  toll: Toll
  selectedToll?: Toll | null
  onTollSelect?: (toll: Toll) => void
}

export const TollMarker: React.FC<Props> = ({
  toll,
  selectedToll,
  onTollSelect,
}) => {
  const [hovered, setHovered] = useState(false)

  const isSelected = selectedToll?.id === toll.id

  const handleMarkerClick = (e: google.maps.MapMouseEvent) => {
    e.domEvent?.stopPropagation()
    if (onTollSelect) {
      onTollSelect(toll)
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
            'relative rounded-full p-1.5 border shadow-sm flex items-center justify-center transition-all duration-300',
            {
              'shadow-md border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 scale-105':
                hovered && !isSelected,
              'border-gray-300 bg-white': !hovered && !isSelected,
              'border-blue-600 bg-gradient-to-br from-blue-100 via-blue-50 to-white border-[1px] shadow-2xl shadow-blue-500/40 scale-125':
                isSelected,
            },
          )}>
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
        </div>
        {/* Внутренняя тень для выбранного маркера */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-white/20 pointer-events-none" />
        )}
      </div>
    </AdvancedMarker>
  )
}
