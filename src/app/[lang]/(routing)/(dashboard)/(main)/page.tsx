'use client'
import React from 'react'
import { MapWithTrucks } from '@/widgets/map'
import { ReportsSection } from '@/widgets/reports-section'
import { InfoCard } from '@/shared/ui'
import { CompanyInfo } from '@/widgets/info/company-info'
import { useQuery } from '@tanstack/react-query'
import { companyQueries } from '@/entities/company'
import { useAuthStore } from '@/shared/store/auth-store'
import { Spinner } from '@/shared/ui'

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore()
  const companyId = user?.companyId
  const isManager = user?.role === 'Manager'

  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    ...companyQueries.company(companyId || ''),
    enabled: !!companyId && !!isAuthenticated && !!user && isManager,
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center text-red-500 py-8">
        Пользователь не аутентифицирован
      </div>
    )
  }

  if (!companyId) {
    return (
      <div className="text-center text-red-500 py-8">ID компании не найден</div>
    )
  }

  if (!isManager) {
    return (
      <div>
        <MapWithTrucks />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 gap-4">
        <Spinner />
        <span className="text-muted-foreground">
          Загрузка данных компании...
        </span>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="text-center text-red-500 py-8">
        {error
          ? `Ошибка загрузки данных компании: ${error.message}`
          : 'Данные компании не найдены'}
      </div>
    )
  }

  return (
    <div>
      {isManager && (
        <>
          <InfoCard title={`Информация о компании: ${company.name}`}>
            <CompanyInfo company={company} />
          </InfoCard>
          <InfoCard title="Отчёты" className="mt-12">
            <ReportsSection />
          </InfoCard>
        </>
      )}
      <div className={isManager ? 'mt-12' : ''}>
        <MapWithTrucks />
      </div>
    </div>
  )
}
