import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { saveBestFuelRoute } from './save-best-fuel-route.service'
import { SaveBestFuelRoutePayload } from './payload/save-best-fuel-route.payload'

export function useSaveBestFuelRouteMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      SaveBestFuelRoutePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['route', 'save-best-fuel-route', ...mutationKey],

    mutationFn: async (payload: SaveBestFuelRoutePayload) => {
      const controller = new AbortController()
      return saveBestFuelRoute(payload, controller.signal)
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
