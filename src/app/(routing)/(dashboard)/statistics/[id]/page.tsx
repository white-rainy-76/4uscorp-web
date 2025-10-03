'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { statisticsQueries } from '@/entities/statistics'
import { Spinner } from '@/shared/ui'

export default function StatisticsPage() {
  const params = useParams()
  const reportId = typeof params?.id === 'string' ? params.id : undefined

  const {
    data: statistics,
    isLoading,
    error,
  } = useQuery({
    ...statisticsQueries.statistics({
      reportId: reportId || '',
      driverId: '', // Пустая строка как указано
    }),
    enabled: !!reportId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
        <span className="ml-2">Загрузка статистики...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Ошибка загрузки статистики: {error.message}
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          Данные статистики не найдены
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Статистика отчета</h1>
        <p className="text-muted-foreground">Report ID: {reportId}</p>
      </div>

      {statistics.fuelPlanReportItems.map((item, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Маршрут: {item.fuelRouteInfo.originName} →{' '}
              {item.fuelRouteInfo.destinationName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Время в пути:</span>
                <p className="font-medium">{item.fuelRouteInfo.driveTime}ч</p>
              </div>
              <div>
                <span className="text-muted-foreground">Расстояние:</span>
                <p className="font-medium">
                  {item.fuelRouteInfo.totalDistance} км
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Топливо:</span>
                <p className="font-medium">{item.fuelRouteInfo.gallons} л</p>
              </div>
              <div>
                <span className="text-muted-foreground">Пошлины:</span>
                <p className="font-medium">${item.fuelRouteInfo.tolls}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Заправки:</h3>
            <div className="space-y-2">
              {item.fuelPlanStation.map((station, stationIndex) => (
                <div
                  key={stationIndex}
                  className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{station.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      {station.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${station.price}/л</p>
                    <p className="text-sm text-muted-foreground">
                      Планируемо: {station.planRefillGl}л
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Фактически: {station.actualRefillGl}л
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
