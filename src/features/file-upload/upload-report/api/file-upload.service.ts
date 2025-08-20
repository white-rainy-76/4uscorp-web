import { api, authorizedRequest } from '@/shared/api/api.instance'
import { AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/shared/store/auth-store'

export const uploadFile = async (
  file: File,
  signal?: AbortSignal,
): Promise<void> => {
  if (!file.name.match(/\.(pdf)$/i)) {
    throw new Error('Поддерживаются только файлы формата pdf')
  }

  const formData = new FormData()
  formData.append('file', file)

  const config: AxiosRequestConfig = {
    signal,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  const getAuthToken = () => useAuthStore.getState().accessToken
  const authConfig = authorizedRequest(getAuthToken, config)

  await api.post(
    'truckstracking-api/Transaction/load-report',
    formData,
    authConfig,
  )
}
