import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { ApiErrorDataDtoSchema } from './api.contracts'
import { normalizeValidationErrors } from './api.lib'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:5000',
})

export function authorizedRequest(
  getAuthToken: () => string | undefined,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
