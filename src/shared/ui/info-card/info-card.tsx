import { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  children: ReactNode
}

export const InfoCard = ({ title, children }: InfoCardProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 mx-auto border border-border">
      <h2 className="text-xl font-black mb-6 text-text-heading">{title}</h2>
      {children}
    </div>
  )
}
