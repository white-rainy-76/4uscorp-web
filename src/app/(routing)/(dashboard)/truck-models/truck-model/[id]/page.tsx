'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { truckGroupQueries } from '@/entities/truck'
import { SetTruckGroupWeightFuelButton } from '@/features/truck/set-truck-group-weight-fuel'
import { InfoCard } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'

export default function TruckModelPage() {
  const params = useParams()
  const truckGroupId = typeof params?.id === 'string' ? params.id : undefined
  const { dictionary } = useDictionary()

  const { data: truckGroup, isLoading } = useQuery({
    ...truckGroupQueries.truckGroup(truckGroupId!),
    enabled: !!truckGroupId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">
          {dictionary.home.truck_models.loading_truck_model}
        </div>
      </div>
    )
  }

  if (!truckGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">
          {dictionary.home.truck_models.truck_model_not_found}
        </div>
      </div>
    )
  }

  return (
    <InfoCard title={dictionary.home.truck_models.truck_model_info}>
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
                buttonText={dictionary.home.drivers.change}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.truck_models.weight}
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
                buttonText={dictionary.home.drivers.change}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.truck_models.fuel_capacity}
            </span>
          </div>
        </div>
      </div>
    </InfoCard>
  )
}
