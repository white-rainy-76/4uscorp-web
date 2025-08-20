import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/shared/store/auth-store'

export const uploadFiles = async (
  files: File[],
  signal?: AbortSignal,
): Promise<void> => {
  if (!files.length) return

  // Проверяем форматы файлов
  files.forEach((file) => {
    if (!file.name.match(/\.(xls|xlsx)$/i)) {
      throw new Error(
        `Файл ${file.name} не поддерживается. Допустимы только .xls и .xlsx`,
      )
    }
  })

  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const config: AxiosRequestConfig = {
    signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post(
    'fuelstations-api/FuelStation/load-prices',
    formData,
    authConfig,
  )
}
