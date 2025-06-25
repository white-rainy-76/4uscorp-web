import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { GasStation } from './types/gas-station'
import { UpdateGasStationsPayload } from './types/gas-station.payload'
import { UpdateGasStationsPayloadSchema } from './payload/gas-stations.payload'
import { updateGasStations } from './gas-station.service'

export function useUpdateGasStationsMutation(
  options: Pick<
    UseMutationOptions<
      GasStation[],
      DefaultError,
      UpdateGasStationsPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['directions', 'create', ...mutationKey],

    mutationFn: async (payload: UpdateGasStationsPayload) => {
      const validatedPayload = UpdateGasStationsPayloadSchema.parse(payload)
      const controller = new AbortController()
      return updateGasStations(validatedPayload, controller.signal)
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
