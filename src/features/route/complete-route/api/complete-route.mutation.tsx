import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query'
import { completeRoutePayloadSchema } from '../payload/route.payload'
import { completeRoute } from './route.service'
import { CompleteRoutePayload } from '../types/route.payload'

export function useCompleteRouteMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      CompleteRoutePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['route', 'completeRoute', ...mutationKey],

    mutationFn: async (payload: CompleteRoutePayload) => {
      const validatedPayload = completeRoutePayloadSchema.parse(payload)
      const controller = new AbortController()
      return completeRoute(validatedPayload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()
      await onMutate?.(variables)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context) => {
      // Инвалидируем запросы для обновления данных маршрута
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['routes', 'get'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['routes', 'getById'],
        }),
        onSuccess?.(data, variables, context),
      ])

      // Дополнительно принудительно обновляем кеш
      console.log('Route completed, forcing cache update...')
      queryClient.removeQueries({
        queryKey: ['routes', 'get'],
      })
      queryClient.removeQueries({
        queryKey: ['routes', 'getById'],
      })
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
