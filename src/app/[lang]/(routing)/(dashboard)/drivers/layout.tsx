'use client'

import { AddDriverButton } from '@/features/driver/add-driver'
import { DriverList } from '@/widgets/lists/driver-list'
import { useDictionary } from '@/shared/lib/hooks'

import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { dictionary } = useDictionary()

  const DriverHeader = () => {
    return (
      <div className="flex flex-row items-center px-6 w-[420px] h-[81px]">
        <div className="flex flex-row items-center gap-4 w-[372px] h-[81px] border-b border-separator flex-grow">
          <h1 className="h-[32px] font-nunito font-black text-2xl leading-8 tracking-[-0.04em] text-text-heading">
            {dictionary.home.drivers.drivers}
          </h1>
          <AddDriverButton />
        </div>
      </div>
    )
  }
  return (
    <div
      className="flex h-screen bg-foreground overflow-hidden"
      style={{ width: 'calc(100vw - 92px)' }}>
      <div className="w-[468px] px-6 flex flex-col gap-4">
        <DriverHeader />
        <DriverList />
      </div>

      <main className="flex-1 overflow-y-auto bg-background rounded-[32px] p-6 my-6 ml-2 mr-6 space-y-6 custom-scroll">
        {children}
      </main>
    </div>
  )
}
