import { api } from '@/shared/api'
import { AxiosRequestConfig } from 'axios'

export const logout = async (signal?: AbortSignal): Promise<void> => {
  const config: AxiosRequestConfig = { signal }
  await api.post(`/auth-api/Auth/logout`, {}, config)
}
