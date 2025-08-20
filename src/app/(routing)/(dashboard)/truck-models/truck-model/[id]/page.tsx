'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { truckGroupQueries } from '@/entities/truck'
import { SetTruckGroupWeightFuelButton } from '@/features/truck/set-truck-group-weight-fuel'
import { InfoCard } from '@/shared/ui'

export default function TruckModelPage() {
  const params = useParams()
  const truckGroupId = typeof params?.id === 'string' ? params.id : undefined

  const { data: truckGroup, isLoading } = useQuery({
    ...truckGroupQueries.truckGroup(truckGroupId!),
    enabled: !!truckGroupId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading truck model...</div>
      </div>
    )
  }

  if (!truckGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Truck model not found</div>
      </div>
    )
  }

  return (
    <InfoCard title="Информация о модели трака">
      <div className="max-w-2xl">
        {/* Weight Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {truckGroup.weight} кг
              </span>
              <SetTruckGroupWeightFuelButton
                truckGroup={truckGroup}
                buttonText="изменить"
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Вес
            </span>
          </div>
        </div>

        {/* Fuel Capacity Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {truckGroup.fuelCapacity} л
              </span>
              <SetTruckGroupWeightFuelButton
                truckGroup={truckGroup}
                buttonText="изменить"
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Объем бака
            </span>
          </div>
        </div>
      </div>
    </InfoCard>
  )
}
