'use client'

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { TruckGroupCard, CardSkeleton } from '@/entities/truck'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { truckGroupQueries } from '@/entities/truck'
import { useParams, useRouter } from 'next/navigation'
import { GenericList, ListFilters } from '@/shared/ui'
import { useAuthStore } from '@/shared/store/auth-store'

export const TruckModelList = () => {
  const [filterText, setFilterText] = useState<string>('')
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const activeTruckGroupId = typeof params?.id === 'string' ? params.id : null

  const { dictionary, lang } = useDictionary()
  const { data: truckGroups = [], isLoading } = useQuery(
    truckGroupQueries.list(),
  )

  const filteredTruckGroups = useMemo(() => {
    const lower = filterText.trim().toLowerCase()
    return truckGroups.filter((truckGroup) =>
      truckGroup.truckGroupName?.toLowerCase().includes(lower),
    )
  }, [filterText, truckGroups])

  // Автоматически выбираем компанию из auth store, если нет активной
  useEffect(() => {
    if (
      filteredTruckGroups.length > 0 &&
      !activeTruckGroupId &&
      !isLoading &&
      user?.companyId
    ) {
      // Ищем компанию по companyId из auth store
      const userCompany = filteredTruckGroups.find(
        (group) => group.id === user.companyId,
      )
      if (userCompany) {
        router.push(`/${lang}/truck-models/truck-model/${userCompany.id}`)
      } else {
        // Если компания не найдена, выбираем первую
        const firstTruckGroup = filteredTruckGroups[0]
        router.push(`/${lang}/truck-models/truck-model/${firstTruckGroup.id}`)
      }
    }
  }, [
    filteredTruckGroups,
    activeTruckGroupId,
    isLoading,
    router,
    user?.companyId,
    lang,
  ])

  const handleFilterChange = useCallback((filters: { search?: string }) => {
    setFilterText(filters.search ?? '')
  }, [])

  return (
    <div className="flex flex-col space-y-6 h-full">
      <ListFilters
        onChange={handleFilterChange}
        initialSearch={filterText}
        placeholder={dictionary.home.truck_models.search_truck_models}
      />

      <GenericList
        items={filteredTruckGroups}
        isLoading={isLoading}
        skeleton={Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
        emptyMessage={dictionary.home.truck_models.no_truck_models_found}
        renderItem={(truckGroup) => (
          <TruckGroupCard
            key={truckGroup.id}
            truckGroup={truckGroup}
            isActive={activeTruckGroupId === truckGroup.id}
          />
        )}
      />
    </div>
  )
}
