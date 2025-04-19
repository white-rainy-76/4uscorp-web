import { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  children: ReactNode
}

export const InfoCard = ({ title, children }: InfoCardProps) => {
  return (
    <div className="bg-[hsl(var(--card))] rounded-2xl shadow-sm p-6 mx-auto border border-[hsl(var(--border))]">
      <h2 className="text-xl font-black mb-6 text-[hsl(var(--text-heading))]">
        {title}
      </h2>
      {children}
    </div>
  )
}
