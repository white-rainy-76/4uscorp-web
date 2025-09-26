'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { companyQueries } from '@/entities/company'
import { InfoCard } from '@/shared/ui'
import { CompanyInfo } from '@/widgets/info/company-info'
import { PricesSection } from '@/widgets/prices-section'
import { ReportsSection } from '@/widgets/reports-section'
import { useDictionary } from '@/shared/lib/hooks'

export default function CompanyPage() {
  const params = useParams()
  const companyId = typeof params?.id === 'string' ? params.id : undefined
  const { dictionary } = useDictionary()

  const { data: company, isLoading } = useQuery({
    ...companyQueries.company(companyId!),
    enabled: !!companyId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">
          {dictionary.home.companies.loading_company}
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">
          {dictionary.home.companies.company_not_found}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <InfoCard title={dictionary.home.companies.company_info}>
        <CompanyInfo company={company} />
      </InfoCard>

      <InfoCard title={dictionary.home.companies.prices}>
        <PricesSection />
      </InfoCard>

      <InfoCard title={dictionary.home.companies.reports}>
        <ReportsSection />
      </InfoCard>
    </div>
  )
}
