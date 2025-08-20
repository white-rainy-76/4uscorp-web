'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { driverQueries } from '@/entities/driver'
import { UpdateDriverButton } from '@/features/driver/update-driver'
import { DriverBonusButton } from '@/features/driver/driver-bonus'
import { AttachDetachDriverButton } from '@/features/driver/attach-detach-driver'
import { InfoCard } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'

export default function DriverPage() {
  const params = useParams()
  const driverId = typeof params?.id === 'string' ? params.id : undefined
  const { dictionary } = useDictionary()
  const { data: driver, isLoading } = useQuery({
    ...driverQueries.driver(driverId!),
    enabled: !!driverId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading driver...</div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Driver not found</div>
      </div>
    )
  }

  return (
    <InfoCard title={dictionary.home.headings.driver_info}>
      <div className="max-w-2xl">
        {/* Full Name Section */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {driver.fullName}
              </span>
              <UpdateDriverButton
                driver={driver}
                buttonText={driver.fullName ? 'изменить' : 'Добавить +'}
                buttonVariant={driver.fullName ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Полное имя
            </span>
          </div>
        </div>

        {/* Phone Section  */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {driver.phone}
              </span>
              <UpdateDriverButton
                driver={driver}
                buttonText={driver.phone ? 'изменить' : 'Добавить +'}
                buttonVariant={driver.phone ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Телефон
            </span>
          </div>
        </div>

        {/* Email Section  */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {driver.email}
              </span>
              <UpdateDriverButton
                driver={driver}
                buttonText={driver.email ? 'изменить' : 'Добавить +'}
                buttonVariant={driver.email ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Email
            </span>
          </div>
        </div>

        {/* Telegram Section  */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {driver.telegramLink}
              </span>
              <UpdateDriverButton
                driver={driver}
                buttonText={driver.telegramLink ? 'изменить' : 'Добавить +'}
                buttonVariant={driver.telegramLink ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Telegram
            </span>
          </div>
        </div>

        {/* Unit Number Section  */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {driver.truck?.unitNumber}
              </span>
              <AttachDetachDriverButton
                driver={driver}
                buttonText={
                  driver.truck?.unitNumber ? 'изменить' : 'Добавить +'
                }
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Unit number
            </span>
          </div>
        </div>

        {/* Bonus Section  */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                {driver.bonus}
              </span>
              <div className="flex gap-2 ml-3">
                <DriverBonusButton
                  driver={driver}
                  buttonText="Добавить"
                  actionType="increase"
                />
                <DriverBonusButton
                  driver={driver}
                  buttonText="Убавить"
                  actionType="decrease"
                />
              </div>
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              Bonuses
            </span>
          </div>
        </div>
      </div>
    </InfoCard>
  )
}
