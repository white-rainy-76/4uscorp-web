'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { companyQueries } from '@/entities/company'
import { InfoCard } from '@/shared/ui'
import { CompanyInfo } from '@/widgets/info/company-info'
import { PricesSection } from '@/widgets/prices-section'
import { ReportsSection } from '@/widgets/reports-section'

export default function CompanyPage() {
  const params = useParams()
  const companyId = typeof params?.id === 'string' ? params.id : undefined

  const { data: company, isLoading } = useQuery({
    ...companyQueries.company(companyId!),
    enabled: !!companyId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading company...</div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Company not found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <InfoCard title="Информация о компании">
        <CompanyInfo company={company} />
      </InfoCard>

      <InfoCard title="Цены">
        <PricesSection />
      </InfoCard>

      <InfoCard title="Отчёты">
        <ReportsSection />
      </InfoCard>
    </div>
  )
}
