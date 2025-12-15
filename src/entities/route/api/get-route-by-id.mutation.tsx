import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { RouteByIdData } from '../model'
import { GetRouteByIdPayload } from '../model'
import { GetRouteByIdPayloadSchema } from './payload/route.payload'
import { getRouteById } from './route.service'

export function useGetRouteByIdMutation(
  options: Pick<
    UseMutationOptions<
      RouteByIdData,
      DefaultError,
      GetRouteByIdPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['routes', 'getById', ...mutationKey],

    mutationFn: async (payload: GetRouteByIdPayload) => {
      const validatedPayload = GetRouteByIdPayloadSchema.parse(payload)
      const controller = new AbortController()
      return getRouteById(validatedPayload, controller.signal)
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
