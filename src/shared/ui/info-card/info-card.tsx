import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface InfoCardProps {
  title: string
  children: ReactNode

  className?: string
}

export const InfoCard = ({ title, children, className }: InfoCardProps) => {
  return (
    <div
      className={twMerge(
        'bg-card rounded-2xl shadow-sm p-6 mx-auto border border-border',
        className,
      )}>
      <h2 className="text-xl font-black mb-6 text-text-heading">{title}</h2>
      {children}
    </div>
  )
}
