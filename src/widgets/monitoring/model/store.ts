'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MonitoringViewMode, TruckStatusFilter } from './types'

interface MonitoringFiltersState {
  mode: MonitoringViewMode
  partnerId: string | null
  companyId: string | null
  search: string
  statusFilter: TruckStatusFilter
}

interface MonitoringFiltersActions {
  setMode: (mode: MonitoringViewMode) => void
  setPartnerId: (id: string | null) => void
  setCompanyId: (id: string | null) => void
  setSearch: (search: string) => void
  setStatusFilter: (status: TruckStatusFilter) => void
  clearSearch: () => void
  clearStatusFilter: () => void
  onPartnerChange: (partnerId: string) => void
}

export type MonitoringFiltersStore = MonitoringFiltersState &
  MonitoringFiltersActions

const initialState: MonitoringFiltersState = {
  mode: 'trucks',
  partnerId: null,
  companyId: null,
  search: '',
  statusFilter: 'ALL',
}

export const useMonitoringFiltersStore = create<MonitoringFiltersStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setMode: (mode) =>
        set({ mode }, undefined, 'monitoringFilters/setMode'),

      setPartnerId: (partnerId) =>
        set({ partnerId }, undefined, 'monitoringFilters/setPartnerId'),

      setCompanyId: (companyId) =>
        set({ companyId }, undefined, 'monitoringFilters/setCompanyId'),

      setSearch: (search) =>
        set({ search }, undefined, 'monitoringFilters/setSearch'),

      setStatusFilter: (statusFilter) =>
        set({ statusFilter }, undefined, 'monitoringFilters/setStatusFilter'),

      clearSearch: () =>
        set({ search: '' }, undefined, 'monitoringFilters/clearSearch'),

      clearStatusFilter: () =>
        set(
          { statusFilter: 'ALL' as TruckStatusFilter },
          undefined,
          'monitoringFilters/clearStatusFilter',
        ),

      onPartnerChange: (partnerId) =>
        set(
          { partnerId, companyId: null },
          undefined,
          'monitoringFilters/onPartnerChange',
        ),
    }),
    { name: 'MonitoringFiltersStore' },
  ),
)
