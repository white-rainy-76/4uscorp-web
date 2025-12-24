import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { editSavedRoute } from './edit-saved-route.service'
import { EditSavedRoutePayload } from './payload/edit-saved-route.payload'

export function useEditSavedRouteMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      EditSavedRoutePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['route', 'edit-saved-route', ...mutationKey],

    mutationFn: async (payload: EditSavedRoutePayload) => {
      const controller = new AbortController()
      return editSavedRoute(payload, controller.signal)
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
