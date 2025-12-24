import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { deleteSavedRoute } from './delete-saved-route.service'
import { DeleteSavedRoutePayload } from './payload/delete-saved-route.payload'

export function useDeleteSavedRouteMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      DeleteSavedRoutePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['route', 'delete-saved-route', ...mutationKey],

    mutationFn: async (payload: DeleteSavedRoutePayload) => {
      const controller = new AbortController()
      return deleteSavedRoute(payload, controller.signal)
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
