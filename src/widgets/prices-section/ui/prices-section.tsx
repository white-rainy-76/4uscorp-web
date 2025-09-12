'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { priceLoadAttemptQueries } from '@/entities/file-upload'
import { PricesUpload } from '@/features/file-upload/upload-prices'
import { Calendar, Check, X } from 'lucide-react'
import { useDictionary } from '@/shared/lib/hooks'

export const PricesSection = () => {
  const { dictionary } = useDictionary()
  const { data: attempts = [], isLoading } = useQuery({
    ...priceLoadAttemptQueries.list(),
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Price Load Attempts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-11 bg-[#F2F2F2] rounded-[20px] animate-pulse"
              />
            ))}
          </div>
        ) : attempts.length > 0 ? (
          <div className="space-y-3">
            {attempts.slice(0, 5).map((attempt) => (
              <div
                key={attempt.id}
                className="w-full h-11 bg-[#F2F2F2] rounded-[20px] flex items-center justify-between px-5">
                {/* Left side - Calendar icon and date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#A8A8A8]" />
                  <div className="flex flex-col">
                    <span className="font-nunito font-normal text-sm leading-[22px] text-[#343434]">
                      {new Date(attempt.startedAt).toLocaleDateString('en-CA')}
                    </span>
                    <span className="text-xs text-[#A8A8A8]">
                      {attempt.totalFiles} {dictionary.home.file_upload.files}
                    </span>
                  </div>
                </div>

                {/* Right side - Status indicator */}
                <div className="flex items-center gap-2">
                  {attempt.isSuccessful ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-green-500 font-medium">
                          {dictionary.home.file_upload.loaded}{' '}
                          {attempt.successfullyProcessedFiles}/
                          {attempt.totalFiles}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-500 " />
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-red-500 font-medium">
                          {dictionary.home.file_upload.failed}{' '}
                          {attempt.failedFiles}/{attempt.totalFiles}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {dictionary.home.file_upload.no_price_attempts}
          </div>
        )}
      </div>

      {/* Right side - PricesUpload */}
      <div>
        <PricesUpload />
      </div>
    </div>
  )
}
