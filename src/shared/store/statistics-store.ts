import { create } from 'zustand'
import { DriverStatistics } from '@/entities/statistics/model/types/driver-statistics'

interface StatisticsState {
  selectedDriver: DriverStatistics | null
  fileReportId: string | null
  setSelectedDriver: (driver: DriverStatistics | null) => void
  setFileReportId: (fileReportId: string | null) => void
  clearStatistics: () => void
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  selectedDriver: null,
  fileReportId: null,
  setSelectedDriver: (driver) => set({ selectedDriver: driver }),
  setFileReportId: (fileReportId) => set({ fileReportId }),
  clearStatistics: () => set({ selectedDriver: null, fileReportId: null }),
}))
