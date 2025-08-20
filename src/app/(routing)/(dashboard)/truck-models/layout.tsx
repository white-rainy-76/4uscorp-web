'use client'

import { TruckModelList } from '@/widgets/lists/truck-model-list'

import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const TruckModelHeader = () => {
    return (
      <div className="flex flex-row items-center px-6 w-[420px] h-[81px]">
        <div className="flex flex-row items-center gap-5 w-[372px] h-[81px] border-b border-separator flex-grow">
          <h1 className=" h-[32px] font-nunito font-black text-2xl leading-8 tracking-[-0.04em] text-text-heading">
            Truck fleet
          </h1>
        </div>
      </div>
    )
  }
  return (
    <div
      className="flex h-screen bg-foreground overflow-hidden"
      style={{ width: 'calc(100vw - 92px)' }}>
      <div className="w-[468px] px-6 flex flex-col gap-4">
        <TruckModelHeader />
        <TruckModelList />
      </div>

      <main className="flex-1 overflow-y-auto bg-background rounded-[32px] p-6 my-6 ml-2 mr-6 space-y-6 custom-scroll">
        {children}
      </main>
    </div>
  )
}
