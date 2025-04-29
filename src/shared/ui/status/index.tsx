import * as React from 'react'
import { cn } from '@/shared/ui/utils'
import { useDictionary } from '@/shared/lib/hooks'

interface StatusLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'Available' | 'Active' | 'Inactive' | string
}

const statusStyles = {
  available: 'text-[#2AC78A]',
  active: 'text-[#FFAF2A]',
  inactive: 'text-[#808080]',
}

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
