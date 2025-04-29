import { DriversList, DriversListHeader } from '@/widgets/driver-list'

import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-screen bg-[hsl(var(--foreground))] overflow-hidden"
      style={{ width: 'calc(100vw - 92px)' }}>
      <div className="w-[468px] px-6 flex flex-col gap-4">
        <DriversListHeader />
        <DriversList />
      </div>

      <main className="flex-1 overflow-y-auto bg-[hsl(var(--background))] rounded-[32px] p-6 my-6 ml-2 mr-6 space-y-6 custom-scroll">
        {children}
      </main>
    </div>
  )
}
