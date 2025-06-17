import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const spinnerVariants = cva('rounded-full animate-spin border-t-transparent', {
  variants: {
    size: {
      xs: 'w-4 h-4 border',
      sm: 'w-6 h-6 border-2',
      md: 'w-8 h-8 border-2',
      lg: 'w-12 h-12 border-4',
      xl: 'w-16 h-16 border-4',
    },
    color: {
      blue: 'border-blue-500',
      red: 'border-red-500',
      green: 'border-green-500',
      purple: 'border-purple-500',
      gradient:
        'border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border',
    },
    speed: {
      slow: 'animate-spin-slow',
      normal: 'animate-spin',
      fast: 'animate-spin-fast',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'blue',
    speed: 'normal',
  },
})

type SpinnerVariants = VariantProps<typeof spinnerVariants>

interface SpinnerProps extends SpinnerVariants {
  className?: string
}
export const Spinner: React.FC<SpinnerProps> = ({
  size,
  color,
  speed,
  className,
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className={spinnerVariants({ size, color, speed, className })} />
    </div>
  )
}
