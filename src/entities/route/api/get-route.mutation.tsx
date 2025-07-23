import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { GetRoutePayload } from './types/route.payload'
import { RouteData } from './types/route'
import { GetRoutePayloadSchema } from './payload/route.payload'
import { getRoute } from './route.service'

export function useGetRouteMutation(
  options: Pick<
    UseMutationOptions<
      RouteData,
      DefaultError,
      GetRoutePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['routes', 'get', ...mutationKey],

    mutationFn: async (payload: GetRoutePayload) => {
      const validatedPayload = GetRoutePayloadSchema.parse(payload)
      const controller = new AbortController()
      return getRoute(validatedPayload, controller.signal)
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
