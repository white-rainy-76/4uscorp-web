import * as React from 'react'
import { cn } from '@/shared/ui/utils'
import { useDictionary } from '@/shared/lib/hooks'
import { TruckStatus } from '@/entities/truck'

interface StatusLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: TruckStatus
}

const statusStyles = {
  active: 'text-green-500',
  inactive: 'text-red-500',
  idle: 'text-gray-500',
} as const

const StatusLabel = React.forwardRef<HTMLSpanElement, StatusLabelProps>(
  ({ className, status, ...props }, ref) => {
    const { dictionary } = useDictionary()
    const lowerCaseStatus = status.toLowerCase()
    const translatedStatus =
      dictionary?.home?.status?.[
        lowerCaseStatus as keyof typeof dictionary.home.status
      ] || status
    const style =
      statusStyles[lowerCaseStatus as keyof typeof statusStyles] || ''
    const combinedClassName = cn('text-sm font-bold', style, className)

    return (
      <span className={combinedClassName} ref={ref} {...props}>
        {translatedStatus}
      </span>
    )
  },
)

StatusLabel.displayName = 'StatusLabel'

export { StatusLabel }
