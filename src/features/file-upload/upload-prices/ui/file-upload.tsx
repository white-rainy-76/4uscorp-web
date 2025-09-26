import React, { useCallback, useState } from 'react'
import { Button } from '@/shared/ui'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/shared/ui'
import { useUploadPricesMutation } from '../api'
import { useQueryClient } from '@tanstack/react-query'
import { priceLoadAttemptQueries } from '@/entities/file-upload'
import { useDictionary } from '@/shared/lib/hooks'

interface FileUploadProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const PricesUpload: React.FC<FileUploadProps> = ({
  className,
  onSuccess,
  onError,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [dragCounter, setDragCounter] = useState(0)
  const queryClient = useQueryClient()
  const { dictionary } = useDictionary()

  const uploadMutation = useUploadPricesMutation({
    onSuccess: () => {
      setSelectedFiles([])
      // Обновляем кеш для priceLoadAttemptQueries
      queryClient.invalidateQueries({
        queryKey: priceLoadAttemptQueries.lists(),
      })
      onSuccess?.()
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    if (e.dataTransfer.items?.length) {
      setDragActive(true)
    }
  }, [])

  const handleDragOut = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragCounter((prev) => prev - 1)
      if (dragCounter === 0) {
        setDragActive(false)
      }
    },
    [dragCounter],
  )

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setDragCounter(0)

    if (e.dataTransfer.files?.length) {
      const validFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.match(/\.(xls|xlsx)$/i),
      )
      setSelectedFiles((prev) => [...prev, ...validFiles])
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const validFiles = Array.from(e.target.files).filter((f) =>
          f.name.match(/\.(xls|xlsx)$/i),
        )
        setSelectedFiles((prev) => [...prev, ...validFiles])
      }
    },
    [],
  )

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles)
    }
  }, [selectedFiles, uploadMutation])

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const isUploading = uploadMutation.isPending

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          selectedFiles.length > 0 && 'border-green-500 bg-green-50',
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        {selectedFiles.length === 0 ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {dictionary.home.file_upload.drag_excel_files}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() =>
                document.getElementById('prices-file-input')?.click()
              }
              disabled={isUploading}>
              {dictionary.home.file_upload.select_files}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              {dictionary.home.file_upload.supported_excel_formats}
            </p>
          </>
        ) : (
          <ul className="space-y-2">
            {selectedFiles.map((file, i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(i)}
                  disabled={isUploading}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        id="prices-file-input"
        type="file"
        accept=".xls,.xlsx"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFiles.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {dictionary.home.file_upload.uploading}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {dictionary.home.file_upload.upload_files.replace(
                  '{{count}}',
                  selectedFiles.length.toString(),
                )}
              </>
            )}
          </Button>
        </div>
      )}

      {uploadMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            {dictionary.home.file_upload.upload_error.replace(
              '{{message}}',
              uploadMutation.error?.message || '',
            )}
          </p>
        </div>
      )}

      {uploadMutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            {dictionary.home.file_upload.files_uploaded_successfully}
          </p>
        </div>
      )}
    </div>
  )
}
