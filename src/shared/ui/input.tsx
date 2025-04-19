import * as React from 'react'
import { cn } from '@/shared/ui/utils'
import { Search } from 'lucide-react'
import { cva, VariantProps } from 'class-variance-authority'

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof sheetVariants> {
  showIcon?: boolean
  prefixText?: string
}

const sheetVariants = cva(
  'relative flex flex-row items-center gap-2 rounded-full',
  {
    variants: {
      variant: {
        default: [
          'bg-white',
          'shadow-[0px_16px_40px_rgba(0,0,0,0.015)]',
          'text-[hsl(var(--text-strong))]',
          '[&>input]:text-[hsl(var(--text-strong))]',
          '[&>input::placeholder]:text-[hsl(var(--placeholder-alt))]',
          '[&>input::placeholder]:opacity-70',
          'h-[56px]',
        ].join(' '),
        gray: [
          'bg-[hsl(var(--input-bg))]',
          'text-[hsl(var(--placeholder))]',
          '[&>input]:text-[hsl(var(--text-strong))]',
          '[&>input::placeholder]:text-[hsl(var(--placeholder))]',
          'h-[44px]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      showIcon = false,
      prefixText,
      variant,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn(sheetVariants({ variant }), className, 'px-6')}>
        {showIcon && (
          <Search className="w-5 h-5 text-[hsl(var(--text-heading))]" />
        )}

        {prefixText && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>{prefixText}</span>
            <span className="h-4 w-px bg-[hsl(var(--separator))]" />
          </div>
        )}

        <input
          type={type}
          className={cn(
            'w-full h-full text-sm font-medium bg-transparent placeholder:text-inherit focus-visible:outline-none',
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
