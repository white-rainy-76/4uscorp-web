import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { updateToll } from './update-toll.service'
import { UpdateTollPayload } from './payload/update-toll.payload'
import { Toll } from '@/entities/tolls'

interface UpdateTollParams {
  id: string
  payload: UpdateTollPayload
}

export function useUpdateTollMutation(
  options: Pick<
    UseMutationOptions<
      Toll,
      DefaultError,
      UpdateTollParams,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['tolls', 'update', ...mutationKey],

    mutationFn: async (params: UpdateTollParams) => {
      const controller = new AbortController()
      return updateToll(params.id, params.payload, controller.signal)
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
