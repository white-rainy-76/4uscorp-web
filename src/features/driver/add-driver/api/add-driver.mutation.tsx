import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { addDriver } from './add-driver.service'
import { AddDriverPayload } from './payload/add-driver.payload'
import { queryClient } from '@/shared/api/query-client'
import { driverQueries } from '@/entities/driver'
import { Driver } from '@/entities/driver'

export function useAddDriverMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      AddDriverPayload,
      { abortController: AbortController; newDriver?: Driver }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['driver', 'add', ...mutationKey],

    mutationFn: async (payload: AddDriverPayload) => {
      const controller = new AbortController()
      return addDriver(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()

      // Создаем временный ID для нового драйвера
      const tempId = `temp-${Date.now()}`

      // Создаем новый объект драйвера
      const newDriver: Driver = {
        id: tempId,
        fullName: variables.name,
        phone: variables.phone,
        email: variables.email,
        telegramLink: variables.telegramLink,
        bonus: 0,
        truck: null,
      }

      // Оптимистично добавляем драйвера в список
      const previousDrivers = queryClient.getQueryData(driverQueries.lists())

      if (previousDrivers) {
        queryClient.setQueryData(driverQueries.lists(), [
          newDriver,
          ...(previousDrivers as Driver[]),
        ])
      }

      await onMutate?.(variables, mutation)
      return { abortController: controller, newDriver }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем список драйверов для получения свежих данных с сервера
      queryClient.invalidateQueries({
        queryKey: driverQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      // Откатываем оптимистичное добавление при ошибке
      if (context?.newDriver) {
        const previousDrivers = queryClient.getQueryData(driverQueries.lists())

        if (previousDrivers) {
          const filteredDrivers = (previousDrivers as Driver[]).filter(
            (driver) => driver.id !== context.newDriver!.id,
          )

          queryClient.setQueryData(driverQueries.lists(), filteredDrivers)
        }
      }

      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context, mutation)
    },

    onSettled: (data, error, variables, context, mutation) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context, mutation)
    },
  })
}
