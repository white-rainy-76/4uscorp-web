import React, { useCallback, useState } from 'react'
import { Button } from '@/shared/ui'
import { Upload, FileSpreadsheet, X } from 'lucide-react'
import { cn } from '@/shared/ui'
import { useUploadReportMutation } from '../api'
import { useQueryClient } from '@tanstack/react-query'
import { reportLoadAttemptQueries } from '@/entities/file-upload'

interface FileUploadProps {
  className?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const ReportUpload: React.FC<FileUploadProps> = ({
  className,
  onSuccess,
  onError,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragCounter, setDragCounter] = useState(0)
  const queryClient = useQueryClient()

  const uploadMutation = useUploadReportMutation({
    onSuccess: () => {
      setSelectedFile(null)
      // Обновляем кеш для reportLoadAttemptQueries
      queryClient.invalidateQueries({
        queryKey: reportLoadAttemptQueries.lists(),
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
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.name.match(/\.(pdf)$/i)) {
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.name.match(/\.(pdf)$/i)) {
        setSelectedFile(file)
      }
    },
    [],
  )

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile)
    }
  }, [selectedFile, uploadMutation])

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const isUploading = uploadMutation.isPending

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Drag & Drop Zone */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          selectedFile && 'border-green-500 bg-green-50',
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}>
        {!selectedFile ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Перетащите файл Pdf сюда или
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={isUploading}>
              Выберите файл
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Поддерживаются файлы .pdf
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isUploading}
              className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="file-input"
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      {selectedFile && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Загрузить файл
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {uploadMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Ошибка загрузки: {uploadMutation.error?.message}
          </p>
        </div>
      )}

      {/* Success Message */}
      {uploadMutation.isSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">Файл успешно загружен!</p>
        </div>
      )}
    </div>
  )
}
