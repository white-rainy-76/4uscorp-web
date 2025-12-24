import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'

import { RouteRequestPayload } from './types/directions.payload'
import { ActionType, Directions } from './types/directions'
import { RouteRequestPayloadSchema } from './payload/directions.payload'
import { handleFuelRoute } from './direction.service'

export function useHandleDirectionsMutation(
  action: ActionType,
  options: Pick<
    UseMutationOptions<
      Directions,
      DefaultError,
      RouteRequestPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['directions', 'handle', ...mutationKey],

    mutationFn: async (payload: RouteRequestPayload) => {
      const validatedPayload = RouteRequestPayloadSchema.parse(payload)
      const controller = new AbortController()
      return handleFuelRoute(validatedPayload, action, controller.signal)
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
