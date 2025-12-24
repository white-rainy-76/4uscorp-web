import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { attachDriver } from './attach-driver.service'
import { detachDriver } from './detach-driver.service'
import { AttachDetachDriverPayload } from './payload/attach-detach-driver.payload'
import { AttachDetachDriverResponse } from '../model'
import { queryClient } from '@/shared/api/query-client'
import { driverQueries } from '@/entities/driver'
import { Driver } from '@/entities/driver'
import { truckUnitQueries } from '@/entities/truck'

export function useAttachDriverMutation(
  options: Pick<
    UseMutationOptions<
      AttachDetachDriverResponse,
      DefaultError,
      AttachDetachDriverPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['driver', 'attach', ...mutationKey],

    mutationFn: async (payload: AttachDetachDriverPayload) => {
      const controller = new AbortController()
      return attachDriver(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()

      // Оптимистично обновляем данные драйвера
      const previousDriver = queryClient.getQueryData<Driver>([
        ...driverQueries.all(),
        'driver',
        variables.driverId,
      ])

      if (previousDriver) {
        const updatedDriver = {
          ...previousDriver,
          truckId: variables.truckId,
          truck: {
            id: variables.truckId,
            unitNumber: null, // Будет обновлено при invalidateQueries
            vin: null,
          },
        }

        queryClient.setQueryData(
          [...driverQueries.all(), 'driver', variables.driverId],
          updatedDriver,
        )
      }

      await onMutate?.(variables, mutation)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем данные драйвера и список для получения свежих данных
      queryClient.invalidateQueries({
        queryKey: [...driverQueries.all(), 'driver', variables.driverId],
      })

      queryClient.invalidateQueries({
        queryKey: driverQueries.lists(),
      })

      // Инвалидируем truckUnitQueries после прикрепления драйвера
      queryClient.invalidateQueries({
        queryKey: truckUnitQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context, mutation)
    },

    onSettled: (data, error, variables, context, mutation) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context, mutation)
    },
  })
}

export function useDetachDriverMutation(
  options: Pick<
    UseMutationOptions<
      AttachDetachDriverResponse,
      DefaultError,
      AttachDetachDriverPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['driver', 'detach', ...mutationKey],

    mutationFn: async (payload: AttachDetachDriverPayload) => {
      const controller = new AbortController()
      return detachDriver(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()

      // Оптимистично обновляем данные драйвера
      const previousDriver = queryClient.getQueryData<Driver>([
        ...driverQueries.all(),
        'driver',
        variables.driverId,
      ])

      if (previousDriver) {
        const updatedDriver = {
          ...previousDriver,
          truckId: null,
          truck: null,
        }

        queryClient.setQueryData(
          [...driverQueries.all(), 'driver', variables.driverId],
          updatedDriver,
        )
      }

      await onMutate?.(variables, mutation)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем данные драйвера и список для получения свежих данных
      queryClient.invalidateQueries({
        queryKey: [...driverQueries.all(), 'driver', variables.driverId],
      })

      queryClient.invalidateQueries({
        queryKey: driverQueries.lists(),
      })

      // Инвалидируем truckUnitQueries после открепления драйвера
      queryClient.invalidateQueries({
        queryKey: truckUnitQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context, mutation)
    },

    onSettled: (data, error, variables, context, mutation) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context, mutation)
    },
  })
}
