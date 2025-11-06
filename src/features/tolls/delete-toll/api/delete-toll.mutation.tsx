import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { deleteToll } from './delete-toll.service'
import { DeleteTollPayload } from './payload/delete-toll.payload'

export function useDeleteTollMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      DeleteTollPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['tolls', 'delete', ...mutationKey],

    mutationFn: async (payload: DeleteTollPayload) => {
      const controller = new AbortController()
      return deleteToll(payload, controller.signal)
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
