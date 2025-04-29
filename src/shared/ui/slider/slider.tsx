'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showValueLabel?: boolean
  }
>(({ className, showValueLabel = false, value, ...props }, ref) => {
  const max = props.max || 100
  const percent = value && value.length > 0 ? (value[0] / max) * 100 : 0

  return (
    <div className="relative pt-6">
      {showValueLabel && value && value.length > 0 && (
        <div
          className="absolute top-[-5px] text-sm font-medium text-[hsl(var(--text-heading))] pointer-events-none select-none"
          style={{
            left: `calc(${percent}%)`,
            transform: `translateX(${percent * -1}%)`,
          }}>
          {value[0]}%
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className,
        )}
        value={value}
        {...props}>
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-500 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
