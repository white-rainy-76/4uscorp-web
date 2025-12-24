import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { assignRoutePayloadSchema } from './payload/route.payload'
import { assignRoute } from './route.service'
import { AssignRoutePayload } from '../types/route.payload'

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
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['route', 'assignRoute', ...mutationKey],

    mutationFn: async (payload: AssignRoutePayload) => {
      const validatedPayload = assignRoutePayloadSchema.parse(payload)
      const controller = new AbortController()
      return assignRoute(validatedPayload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()
      await onMutate?.(variables, mutation)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем запросы для обновления данных маршрута
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['routes', 'get'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['routes', 'getById'],
        }),
        onSuccess?.(data, variables, context, mutation),
      ])
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
