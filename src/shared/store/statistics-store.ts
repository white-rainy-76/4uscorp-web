import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { DriverStatistics } from '@/entities/statistics/model/types/driver-statistics'

interface StatisticsState {
  selectedDriver: DriverStatistics | null
  fileReportId: string | null
  setSelectedDriver: (driver: DriverStatistics | null) => void
  setFileReportId: (fileReportId: string | null) => void
  clearStatistics: () => void
}

export const useStatisticsStore = create<StatisticsState>()(
  devtools(
    (set) => ({
      selectedDriver: null,
      fileReportId: null,
      setSelectedDriver: (driver) =>
        set(
          { selectedDriver: driver },
          undefined,
          'statistics/setSelectedDriver',
        ),
      setFileReportId: (fileReportId) =>
        set({ fileReportId }, undefined, 'statistics/setFileReportId'),
      clearStatistics: () =>
        set(
          { selectedDriver: null, fileReportId: null },
          undefined,
          'statistics/clearStatistics',
        ),
    }),
    {
      name: 'StatisticsStore',
    },
  ),
)
