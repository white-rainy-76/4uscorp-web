import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { deleteTollRoad } from './delete-road.service'
import { DeleteTollRoadPayload } from './payload/delete-road.payload'

export function useDeleteTollRoadMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      DeleteTollRoadPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['toll-roads', 'delete', ...mutationKey],

    mutationFn: async (payload: DeleteTollRoadPayload) => {
      const controller = new AbortController()
      return deleteTollRoad(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()
      await onMutate?.(variables, mutation)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context, mutation) => {
      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      if (context?.abortController) {
        context.abortController.abort('Request cancelled due to error')
      }
      onError?.(error, variables, context, mutation)
    },

    onSettled: (data, error, variables, context, mutation) => {
      if (context?.abortController) {
        context.abortController.abort('Request settled')
      }
      onSettled?.(data, error, variables, context, mutation)
    },
  })
}
