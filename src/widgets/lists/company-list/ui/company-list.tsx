'use client'

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { CompanyCard, CompanyCardSkeleton } from '@/entities/company'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { companyQueries } from '@/entities/company'
import { useParams, useRouter } from 'next/navigation'
import { GenericList, ListFilters } from '@/shared/ui'

export const CompanyList = () => {
  const [filterText, setFilterText] = useState<string>('')
  const params = useParams()
  const router = useRouter()
  const activeCompanyId = typeof params?.id === 'string' ? params.id : null

  const { dictionary, lang } = useDictionary()
  const { data: companies = [], isLoading } = useQuery(companyQueries.list())

  const filteredCompanies = useMemo(() => {
    const lower = filterText.trim().toLowerCase()
    return companies.filter((company) =>
      company.name?.toLowerCase().includes(lower),
    )
  }, [filterText, companies])

  // Автоматически выбираем первый элемент, если нет активного
  useEffect(() => {
    if (filteredCompanies.length > 0 && !activeCompanyId && !isLoading) {
      const firstCompany = filteredCompanies[0]
      router.push(`/${lang}/companies/company/${firstCompany.id}`)
    }
  }, [filteredCompanies, activeCompanyId, isLoading, router, lang])

  const handleFilterChange = useCallback((filters: { search?: string }) => {
    setFilterText(filters.search ?? '')
  }, [])

  return (
    <div className="flex flex-col space-y-6 h-full">
      <ListFilters
        onChange={handleFilterChange}
        initialSearch={filterText}
        placeholder={dictionary.home.input_fields.search_companies}
      />

      <GenericList
        items={filteredCompanies}
        isLoading={isLoading}
        skeleton={Array.from({ length: 12 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
        emptyMessage={dictionary.home.lists.no_companies_found}
        renderItem={(company) => (
          <CompanyCard
            key={company.id}
            company={company}
            isActive={activeCompanyId === company.id}
          />
        )}
      />
    </div>
  )
}
