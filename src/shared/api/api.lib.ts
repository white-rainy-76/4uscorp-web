import { AxiosResponse } from 'axios'
import { z, ZodType } from 'zod'
import { ApiErrorData, ApiErrorDataDto } from './api.types'

export function responseContract<Data>(schema: ZodType<Data>) {
  return function parseResponse(
    response: AxiosResponse<unknown>,
  ): AxiosResponse<Data> {
    try {
      const data = schema.parse(response.data)
      return { ...response, data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Ошибка валидации Zod в responseContract:', error.issues)
      } else {
        console.error('Неизвестная ошибка при парсинге ответа API:', error)
      }

      throw error
    }
  }
}

export function normalizeValidationErrors(data: ApiErrorDataDto): ApiErrorData {
  return Object.entries(data.errors).flatMap(([field, messages]) =>
    messages.map((message) => `${field} ${message}`),
  )
}
