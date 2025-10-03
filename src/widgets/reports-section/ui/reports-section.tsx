'use client'

import React from 'react'
import { Calendar, Check } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reportLoadAttemptQueries } from '@/entities/file-upload'
import { Spinner } from '@/shared/ui'
import { ReportLoadAttempt } from '@/entities/file-upload/api/contracts/report-load-attempt.contract'
import { FileUpload as ReportUpload } from '@/features/file-upload/upload-report'
import { useDictionary } from '@/shared/lib/hooks'
import { useRouter } from 'next/navigation'

export const ReportsSection = () => {
  const { dictionary, lang } = useDictionary()
  const router = useRouter()
  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery({
    ...reportLoadAttemptQueries.list(),
  })

  const typedReports: ReportLoadAttempt[] = reports

  const handleWatchingClick = (transactionReportFileId: string) => {
    router.push(`/${lang}/statistics/${transactionReportFileId}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 gap-4">
        <Spinner />
        <span className="text-muted-foreground">
          {dictionary.home.file_upload.loading_reports}
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error instanceof Error
          ? dictionary.home.file_upload.loading_reports_error_with_message.replace(
              '{{message}}',
              error.message,
            )
          : dictionary.home.file_upload.loading_reports_error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Reports Load Attempts List */}
      <div className="space-y-4">
        {typedReports.length > 0 ? (
          <div className="space-y-3">
            {typedReports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className="w-full h-11 bg-[#F2F2F2] rounded-[20px] flex items-center justify-between px-5">
                {/* Left side - Calendar icon and date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#A8A8A8]" />
                  <div className="flex flex-col">
                    <span className="font-nunito font-normal text-sm leading-[22px] text-[#343434]">
                      {new Date(report.startedAt).toLocaleDateString('en-CA')}
                    </span>
                    <span className="text-xs text-[#A8A8A8]">
                      {report.totalFiles} {dictionary.home.file_upload.files}
                    </span>
                  </div>
                </div>

                {/* Right side - Status indicator */}
                <div className="flex items-center gap-2">
                  {report.isSuccessful ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-green-500 font-medium">
                          {dictionary.home.file_upload.loaded}{' '}
                          {report.successfullyProcessedFiles}/
                          {report.totalFiles}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-red-500 font-medium">
                          {dictionary.home.file_upload.failed}
                        </span>
                        <span className="text-xs text-red-500">
                          {report.failedFiles}/{report.totalFiles}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Watching button */}
                  <button
                    onClick={() =>
                      handleWatchingClick(report.transactionReportFileId)
                    }
                    className="ml-2 text-sm text-blue-600 hover:underline transition-all duration-200"
                    title="View statistics">
                    view
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {dictionary.home.file_upload.no_report_attempts}
          </div>
        )}
      </div>

      {/* Right side - ReportUpload */}
      <div>
        <ReportUpload />
      </div>
    </div>
  )
}
