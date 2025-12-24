import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { GetTollRoadsByBoundingBoxResponse } from '../model'
import { GetTollRoadsByBoundingBoxPayload } from '../model'
import { GetTollRoadsByBoundingBoxPayloadSchema } from './payload/toll-roads.payload'
import { getTollRoadsByBoundingBox } from './toll-roads.service'

export function useGetTollRoadsByBoundingBoxMutation(
  options: Pick<
    UseMutationOptions<
      GetTollRoadsByBoundingBoxResponse,
      DefaultError,
      GetTollRoadsByBoundingBoxPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['toll-roads', 'get-by-bounding-box', ...mutationKey],

    mutationFn: async (payload: GetTollRoadsByBoundingBoxPayload) => {
      const validatedPayload =
        GetTollRoadsByBoundingBoxPayloadSchema.parse(payload)
      const controller = new AbortController()
      return getTollRoadsByBoundingBox(validatedPayload, controller.signal)
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
