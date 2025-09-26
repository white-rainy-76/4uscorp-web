import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { GetGasStationsResponse } from '../model'
import { GetGasStationsPayload } from '../model'
import { GetGasStationsPayloadSchema } from './payload/gas-stations.payload'
import { getGasStations } from './gas-station.service'

export function useGetGasStationsMutation(
  options: Pick<
    UseMutationOptions<
      GetGasStationsResponse,
      DefaultError,
      GetGasStationsPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['gas-station', 'get', ...mutationKey],

    mutationFn: async (payload: GetGasStationsPayload) => {
      const validatedPayload = GetGasStationsPayloadSchema.parse(payload)
      const controller = new AbortController()
      return getGasStations(validatedPayload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()
      await onMutate?.(variables)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context) => {
      await Promise.all([onSuccess?.(data, variables, context)])
    },

    onError: (error, variables, context) => {
      if (context?.abortController) {
        context.abortController.abort('Request cancelled due to error')
      }
      onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      if (context?.abortController) {
        context.abortController.abort('Request settled')
      }
      onSettled?.(data, error, variables, context)
    },
  })
}
