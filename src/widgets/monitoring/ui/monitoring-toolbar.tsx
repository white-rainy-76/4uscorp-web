'use client'

import React, { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'

import { companyQueries, type Company } from '@/entities/company'
import { partnerQueries, type Partner } from '@/entities/partner'
import { truckQueries } from '@/entities/truck'
import { useDictionary } from '@/shared/lib/hooks'
import { Badge } from '@/shared/ui/badge'
import {
  Combobox,
  type ComboboxOption,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Spinner,
  cn,
} from '@/shared/ui'
import type { TruckStatusFilter } from '../model/types'
import { useMonitoringFiltersStore } from '../model/store'

export function MonitoringToolbar() {
  const { dictionary } = useDictionary()
  const partnerId = useMonitoringFiltersStore((s) => s.partnerId)
  const companyId = useMonitoringFiltersStore((s) => s.companyId)
  const search = useMonitoringFiltersStore((s) => s.search)
  const statusFilter = useMonitoringFiltersStore((s) => s.statusFilter)
  const setPartnerId = useMonitoringFiltersStore((s) => s.onPartnerChange)
  const setCompanyId = useMonitoringFiltersStore((s) => s.setCompanyId)
  const setSearch = useMonitoringFiltersStore((s) => s.setSearch)
  const clearSearch = useMonitoringFiltersStore((s) => s.clearSearch)
  const setStatusFilter = useMonitoringFiltersStore((s) => s.setStatusFilter)
  const mode = useMonitoringFiltersStore((s) => s.mode)

  const {
    data: partners = [],
    isLoading: isPartnersLoading,
    error: partnersError,
  } = useQuery(partnerQueries.list())

  const {
    data: companiesByPartner = [],
    isLoading: isCompaniesLoading,
    error: companiesError,
  } = useQuery({
    ...companyQueries.byPartner(partnerId ?? ''),
    enabled: !!partnerId,
  })

  useEffect(() => {
    if (companyId && companiesByPartner.some((c) => c.id === companyId)) return
    setCompanyId(companiesByPartner[0]?.id ?? null)
  }, [companyId, companiesByPartner, setCompanyId])

  const { data: trucks = [] } = useQuery({
    ...truckQueries.listByCompany(companyId ?? ''),
    enabled: !!companyId && mode === 'trucks',
  })

  const filteredCount = useMemo(() => {
    if (mode !== 'trucks') return 0
    const q = search.trim().toLowerCase()
    const byStatus =
      statusFilter === 'ALL'
        ? trucks
        : trucks.filter((t) => t.status === statusFilter)
    if (!q) return byStatus.length
    return byStatus.filter((t) => {
      const hay = [
        t.name,
        t.licensePlate,
        t.driver?.fullName ?? '',
        t.make,
        t.model,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    }).length
  }, [mode, search, statusFilter, trucks])

  const selectedPartner = useMemo(
    () => partners.find((p) => p.partnerId === partnerId) ?? null,
    [partners, partnerId],
  )

  const selectedCompany = useMemo(
    () => companiesByPartner.find((c) => c.id === companyId) ?? null,
    [companiesByPartner, companyId],
  )

  const partnerOptions: ComboboxOption[] = useMemo(
    () =>
      partners
        .map((p: Partner) => ({
          value: p.partnerId,
          label: p.fullName || p.userName || p.partnerId,
          hint:
            p.email || p.phone
              ? [p.email, p.phone].filter(Boolean).join(' • ')
              : undefined,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [partners],
  )

  useEffect(() => {
    if (partnerId) return
    if (partnerOptions.length > 0) setPartnerId(partnerOptions[0].value)
  }, [partnerId, partnerOptions, setPartnerId])

  const companyOptions: ComboboxOption[] = useMemo(
    () =>
      companiesByPartner
        .map((c: Company) => ({
          value: c.id,
          label: c.name,
          hint:
            c.trucksCount !== undefined && c.driversCount !== undefined
              ? `${c.trucksCount} ${dictionary.home.monitoring.trucks_unit} • ${c.driversCount} ${dictionary.home.monitoring.drivers_unit}`
              : undefined,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [companiesByPartner],
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        <div className="xl:col-span-3">
          <div className="text-xs font-bold text-muted-foreground mb-2">
            {dictionary.home.monitoring.partner_label}
          </div>
          <Combobox
            value={partnerId}
            options={partnerOptions}
            placeholder={dictionary.home.monitoring.partner_placeholder}
            searchPlaceholder={dictionary.home.monitoring.partner_search_placeholder}
            emptyText={dictionary.home.monitoring.partners_empty}
            className={cn(
              (isPartnersLoading || !!partnersError) &&
                'opacity-60 pointer-events-none',
            )}
            onChange={setPartnerId}
          />
        </div>

        <div className="xl:col-span-3">
          <div className="text-xs font-bold text-muted-foreground mb-2">
            {dictionary.home.monitoring.company_label}
          </div>
          <Combobox
            value={companyId}
            options={companyOptions}
            placeholder={dictionary.home.monitoring.company_placeholder}
            searchPlaceholder={dictionary.home.monitoring.company_search_placeholder}
            emptyText={dictionary.home.monitoring.companies_empty}
            className={cn(
              (isCompaniesLoading || !partnerId || !!companiesError) &&
                'opacity-60 pointer-events-none',
            )}
            onChange={setCompanyId}
          />
        </div>

        <div className="xl:col-span-2">
          <div className="text-xs font-bold text-muted-foreground mb-2">
            {dictionary.home.monitoring.status_label}
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as TruckStatusFilter)}>
            <SelectTrigger className="h-11 rounded-xl text-text-heading bg-background">
              <SelectValue placeholder={dictionary.home.monitoring.status_all} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{dictionary.home.monitoring.status_all}</SelectItem>
              <SelectItem value="ACTIVE">
                {dictionary.home.status.active}
              </SelectItem>
              <SelectItem value="IDLE">
                {dictionary.home.status.idle}
              </SelectItem>
              <SelectItem value="INACTIVE">
                {dictionary.home.status.inactive}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="xl:col-span-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-muted-foreground">
              {dictionary.home.monitoring.search_label}
            </div>
            {search ? (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-bold text-primary hover:underline">
                {dictionary.home.monitoring.clear}
              </button>
            ) : null}
          </div>
          <div className="flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder={dictionary.home.truck.search_truck}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-text-heading placeholder:text-muted-foreground focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-xs">
          {selectedPartner?.fullName || selectedPartner?.userName || '—'}
        </Badge>
        <span>/</span>
        <Badge variant="outline" className="text-xs">
          {selectedCompany?.name ?? '—'}
        </Badge>

        <div className="ml-auto flex items-center gap-3">
          {(isPartnersLoading || isCompaniesLoading) && (
            <span className="inline-flex items-center gap-2">
              <Spinner />
              {dictionary.home.monitoring.updating}
            </span>
          )}
          {(partnersError || companiesError) && (
            <span className="text-red-500">
              {dictionary.home.monitoring.partners_companies_error}
            </span>
          )}
          {mode === 'trucks' && (
            <span>
              {dictionary.home.monitoring.showing_count}{' '}
              <span className="font-bold text-text-heading">
                {filteredCount}
              </span>{' '}
              {dictionary.home.monitoring.of}{' '}
              <span className="font-bold text-text-heading">{trucks.length}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
