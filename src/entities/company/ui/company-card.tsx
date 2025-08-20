'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage, Icon } from '@/shared/ui'
import { Company } from '../model/types/company'
import { useSetCompanyUserMutation } from '@/features/company/set-company-user'
import { useAuthStore } from '@/shared/store/auth-store'
import { UsersRound } from 'lucide-react'

interface CompanyCardProps {
  company: Company
  isActive: boolean
}

export const CompanyCard = ({ company, isActive }: CompanyCardProps) => {
  const router = useRouter()
  const { mutateAsync: setCompanyUser } = useSetCompanyUserMutation()
  const { user } = useAuthStore()

  const handleClick = async () => {
    try {
      // Выполняем запрос на сервер для установки пользователя компании
      if (user?.userId) {
        await setCompanyUser({
          userId: user.userId,
          companyId: company.id,
        })
      }

      // Переходим на страницу компании
      router.push(`/companies/company/${company.id}`)
    } catch (error) {
      console.error('Failed to set company user:', error)
      // В случае ошибки все равно переходим на страницу
      router.push(`/companies/company/${company.id}`)
    }
  }

  const handleMouseEnter = () => {
    router.prefetch(`/companies/company/${company.id}`)
  }

  const companyInitials =
    company.name
      ?.split(' ')
      .map((name) => name[0])
      .join('') || '?'

  return (
    <div
      className={`h-[104px] rounded-[24px] cursor-pointer transition-colors duration-200 flex items-center justify-between px-4
      bg-background
      ${isActive && 'ring-2 ring-primary'}
      hover:bg-muted
      ${isActive && 'hover:bg-accent'}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}>
      {/* Left part - Company Name */}
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={'https://github.com/shadcn.png'} />
          <AvatarFallback>{companyInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-nunito font-black text-2xl leading-8 tracking-[-0.04em] text-[#192A3E]">
            {company.name}
          </h2>
        </div>
      </div>

      {/* Right part - Trucks and Drivers Count */}
      <div className="flex items-center gap-[30px]">
        {/* Trucks Count */}
        <div className="flex items-center gap-2">
          <Icon name="common/truck-model" className="w-5 h-5 text-[#1E2022]" />
          <span className="font-nunito font-extrabold text-sm leading-[100%] tracking-[1px] text-[#1E2022]">
            {company.trucksCount}
          </span>
        </div>

        {/* Drivers Count */}
        <div className="flex items-center gap-2">
          <UsersRound className="w-5 h-5 text-[#4964d8]" />
          <span className="font-nunito font-extrabold text-sm leading-[100%] tracking-[1px] text-[#1E2022]">
            {company.driversCount}
          </span>
        </div>
      </div>
    </div>
  )
}
