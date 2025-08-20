'use client'

import React from 'react'
import { Calendar, Check } from 'lucide-react'

export const ReportsSection = () => {
  // TODO: Добавить query для отчётов когда будет готов API
  const reports: Array<any> = [] // Пока пустой массив

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Reports Load Attempts List */}
      <div className="space-y-4">
        {reports.length > 0 ? (
          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="w-full h-11 bg-[#F2F2F2] rounded-[20px] flex items-center justify-between px-5">
                {/* Left side - Calendar icon and date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#A8A8A8]" />
                  <span className="font-nunito font-normal text-sm leading-[22px] text-[#343434]">
                    {new Date(report.startedAt).toLocaleDateString('en-CA')}
                  </span>
                </div>

                {/* Right side - Status indicator */}
                <div className="flex items-center gap-2">
                  {report.isSuccessful ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500 font-medium">
                        loaded
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-red-500 font-medium">
                        failed
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Нет попыток загрузки отчётов
          </div>
        )}
      </div>

      {/* Right side - UploadReport */}
      <div>
        <div className="text-center text-muted-foreground py-8">
          Компонент загрузки отчётов будет добавлен позже
        </div>
      </div>
    </div>
  )
}
