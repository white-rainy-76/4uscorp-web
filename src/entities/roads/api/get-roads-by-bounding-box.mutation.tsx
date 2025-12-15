import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { GetRoadsByBoundingBoxResponse } from '../model'
import { GetRoadsByBoundingBoxPayload } from '../model'
import { GetRoadsByBoundingBoxPayloadSchema } from './payload/roads.payload'
import { getRoadsByBoundingBox } from './roads.service'

export function useGetRoadsByBoundingBoxMutation(
  options: Pick<
    UseMutationOptions<
      GetRoadsByBoundingBoxResponse,
      DefaultError,
      GetRoadsByBoundingBoxPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['roads', 'get-by-bounding-box', ...mutationKey],

    mutationFn: async (payload: GetRoadsByBoundingBoxPayload) => {
      const validatedPayload = GetRoadsByBoundingBoxPayloadSchema.parse(payload)
      const controller = new AbortController()
      return getRoadsByBoundingBox(validatedPayload, controller.signal)
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
