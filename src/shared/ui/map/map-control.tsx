import React from 'react'
import classNames from 'classnames'

interface MapControlButtonProps {
  icon: React.ReactNode
  onClick: () => void
  className?: string
}

export const MapControlButton: React.FC<MapControlButtonProps> = ({
  icon,
  onClick,
  className,
}) => (
  <button
    onClick={onClick}
    className={classNames(
      'bg-white p-2 rounded shadow hover:bg-gray-100 text-black transition',
      className,
    )}>
    {icon}
  </button>
)
