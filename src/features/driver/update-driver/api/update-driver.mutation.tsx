import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { updateDriver } from './update-driver.service'
import { UpdateDriverPayload } from './payload/update-driver.payload'
import { queryClient } from '@/shared/api/query-client'
import { driverQueries } from '@/entities/driver'
import { Driver } from '@/entities/driver'

export function useUpdateDriverMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      UpdateDriverPayload,
      { abortController: AbortController; previousDriver?: Driver }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['driver', 'update', ...mutationKey],

    mutationFn: async (payload: UpdateDriverPayload) => {
      const controller = new AbortController()
      return updateDriver(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()

      // Сохраняем предыдущее состояние драйвера
      const previousDriver = queryClient.getQueryData<Driver>([
        ...driverQueries.all(),
        'driver',
        variables.driverId,
      ])

      // Оптимистично обновляем данные
      if (previousDriver) {
        const updatedDriver = {
          ...previousDriver,
          ...variables,
        }

        queryClient.setQueryData(
          [...driverQueries.all(), 'driver', variables.driverId],
          updatedDriver,
        )
      }

      await onMutate?.(variables, mutation)
      return { abortController: controller, previousDriver }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем список драйверов для обновления в фоне
      queryClient.invalidateQueries({
        queryKey: driverQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      // Откатываем оптимистичное обновление при ошибке
      if (context?.previousDriver) {
        queryClient.setQueryData(
          [...driverQueries.all(), 'driver', variables.driverId],
          context.previousDriver,
        )
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
