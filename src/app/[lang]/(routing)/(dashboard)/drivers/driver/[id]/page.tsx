'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { driverQueries } from '@/entities/driver'
import { userQueries } from '@/entities/user'
import { UpdateDriverButton } from '@/features/driver/update-driver'
import { DriverBonusButton } from '@/features/driver/driver-bonus'
import { AttachDetachDriverButton } from '@/features/driver/attach-detach-driver'
import { SetUserRoleButton } from '@/features/users/set-user-role'
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

  const { data: user, isLoading: isUserLoading } = useQuery({
    ...userQueries.user(driver?.userId!),
    enabled: !!driver?.userId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{dictionary.home.drivers.loading_driver}</div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">
          {dictionary.home.drivers.driver_not_found}
        </div>
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
                buttonText={
                  driver.fullName
                    ? dictionary.home.drivers.change
                    : dictionary.home.drivers.add
                }
                buttonVariant={driver.fullName ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.drivers.full_name}
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
                buttonText={
                  driver.phone
                    ? dictionary.home.drivers.change
                    : dictionary.home.drivers.add
                }
                buttonVariant={driver.phone ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.drivers.phone}
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
                buttonText={
                  driver.email
                    ? dictionary.home.drivers.change
                    : dictionary.home.drivers.add
                }
                buttonVariant={driver.email ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.drivers.email}
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
                buttonText={
                  driver.telegramLink
                    ? dictionary.home.drivers.change
                    : dictionary.home.drivers.add
                }
                buttonVariant={driver.telegramLink ? 'edit' : 'add'}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.drivers.telegram}
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
                  driver.truck?.unitNumber
                    ? dictionary.home.drivers.change
                    : dictionary.home.drivers.add
                }
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.drivers.unit_number}
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
                  buttonText={dictionary.home.drivers.add_bonus}
                  actionType="increase"
                />
                <DriverBonusButton
                  driver={driver}
                  buttonText={dictionary.home.drivers.decrease_bonus}
                  actionType="decrease"
                />
              </div>
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              {dictionary.home.drivers.bonuses}
            </span>
          </div>
        </div>

        {/* User Role Section  */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              {driver.userId && user && !isUserLoading ? (
                <div className="flex items-center gap-1">
                  <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                    {user.roles.join(', ')}
                  </span>
                </div>
              ) : (
                <span className="font-nunito text-base font-extrabold leading-6 tracking-[-0.04em] text-[#000000]">
                  {driver.userId ? 'Loading...' : 'No user account'}
                </span>
              )}
              <SetUserRoleButton
                userId={driver.userId ? driver.userId : null}
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="font-nunito text-xs font-medium leading-4 tracking-[-0.04em] text-text-heading">
              User Role
            </span>
          </div>
        </div>
      </div>
    </InfoCard>
  )
}
