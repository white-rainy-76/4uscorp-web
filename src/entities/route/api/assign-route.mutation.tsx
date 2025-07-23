import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { AssignRoutePayload } from './types/route.payload'
import { AssignRoutePayloadSchema } from './payload/route.payload'
import { assignRoute } from './route.service'

export function useAssignRouteMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      AssignRoutePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['routes', 'assignRoute', ...mutationKey],

    mutationFn: async (payload: AssignRoutePayload) => {
      const validatedPayload = AssignRoutePayloadSchema.parse(payload)
      const controller = new AbortController()
      return assignRoute(validatedPayload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()
      await onMutate?.(variables)
      return { abortController: controller }
    },

    onError: (error, variables, context) => {
      if (context?.abortController) {
        context.abortController.abort('Request cancelled due to error')
      }
      onError?.(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context)
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables, context)
    },
  })
}
