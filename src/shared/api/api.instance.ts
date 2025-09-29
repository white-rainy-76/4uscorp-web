import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiErrorDataDtoSchema } from './api.contracts'
import { normalizeValidationErrors } from './api.lib'
import { storage, STORAGE_KEYS } from '@/shared/lib/storage'
import { jwt } from '@/shared/lib/jwt'
import { useAuthStore } from '../store'

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://test.foruscorp.net:5011',
  withCredentials: true,
})

export function authorizedRequest(
  getAuthToken: () => string | null | undefined,
  config?: AxiosRequestConfig,
) {
  const token = getAuthToken()
  return {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  }
}

const REFRESH_TOKEN_URL = '/auth-api/Auth/refresh'
// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === REFRESH_TOKEN_URL) {
        originalRequest._retry = true
        return Promise.reject(error)
      }

      try {
        // Call refresh endpoint without parameters (server gets refresh token from httpOnly cookie)
        const refreshResponse = await api.get(REFRESH_TOKEN_URL, {})

        if (refreshResponse.data.accessToken) {
          const newAccessToken = refreshResponse.data.accessToken

          // Update access token in storage
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken)

          // Extract and update user data
          const userData = jwt.extractUserData(newAccessToken)
          if (userData) {
            storage.set(STORAGE_KEYS.USER_DATA, userData)
          }

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const validation = ApiErrorDataDtoSchema.safeParse(error.response?.data)

    if (!validation.success) {
      return Promise.reject(error)
    }

    const normalizedErrorResponse = {
      ...error.response!,
      data: normalizeValidationErrors(validation.data),
    }

    return Promise.reject(
      new AxiosError(
        error.message,
        error.code,
        error.config,
        error.request,
        normalizedErrorResponse,
      ),
    )
  },
)
