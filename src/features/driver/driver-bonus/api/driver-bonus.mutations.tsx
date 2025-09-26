import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { increaseDriverBonus } from './increase-driver-bonus.service'
import { decreaseDriverBonus } from './decrease-driver-bonus.service'
import { DriverBonusPayload } from './payload/driver-bonus.payload'
import { DriverBonusResponse } from '../model'
import { queryClient } from '@/shared/api/query-client'
import { driverQueries } from '@/entities/driver'
import { Driver } from '@/entities/driver'

export function useIncreaseDriverBonusMutation(
  options: Pick<
    UseMutationOptions<
      DriverBonusResponse,
      DefaultError,
      DriverBonusPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['driver', 'bonus', 'increase', ...mutationKey],

    mutationFn: async (payload: DriverBonusPayload) => {
      const controller = new AbortController()
      return increaseDriverBonus(payload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()

      // Оптимистично обновляем бонусы драйвера
      const previousDriver = queryClient.getQueryData<Driver>([
        ...driverQueries.all(),
        'driver',
        variables.driverId,
      ])

      if (previousDriver) {
        const updatedDriver = {
          ...previousDriver,
          bonus: (previousDriver.bonus || 0) + variables.bonus,
        }

        queryClient.setQueryData(
          [...driverQueries.all(), 'driver', variables.driverId],
          updatedDriver,
        )
      }

      await onMutate?.(variables)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context) => {
      // Инвалидируем список драйверов для обновления в фоне
      queryClient.invalidateQueries({
        queryKey: driverQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context)])
    },

    onError: (error, variables, context) => {
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context)
    },
  })
}

export function useDecreaseDriverBonusMutation(
  options: Pick<
    UseMutationOptions<
      DriverBonusResponse,
      DefaultError,
      DriverBonusPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['driver', 'bonus', 'decrease', ...mutationKey],

    mutationFn: async (payload: DriverBonusPayload) => {
      const controller = new AbortController()
      return decreaseDriverBonus(payload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()

      // Оптимистично обновляем бонусы драйвера
      const previousDriver = queryClient.getQueryData<Driver>([
        ...driverQueries.all(),
        'driver',
        variables.driverId,
      ])

      if (previousDriver) {
        const updatedDriver = {
          ...previousDriver,
          bonus: Math.max(0, (previousDriver.bonus || 0) - variables.bonus),
        }

        queryClient.setQueryData(
          [...driverQueries.all(), 'driver', variables.driverId],
          updatedDriver,
        )
      }

      await onMutate?.(variables)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context) => {
      // Инвалидируем список драйверов для обновления в фоне
      queryClient.invalidateQueries({
        queryKey: driverQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context)])
    },

    onError: (error, variables, context) => {
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context)
    },
  })
}
