import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { GetTollsByBoundingBoxResponse } from '../model'
import { GetTollsByBoundingBoxPayload } from '../model'
import { GetTollsByBoundingBoxPayloadSchema } from './payload/tolls.payload'
import { getTollsByBoundingBox } from './tolls.service'

export function useGetTollsByBoundingBoxMutation(
  options: Pick<
    UseMutationOptions<
      GetTollsByBoundingBoxResponse,
      DefaultError,
      GetTollsByBoundingBoxPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['tolls', 'get-by-bounding-box', ...mutationKey],

    mutationFn: async (payload: GetTollsByBoundingBoxPayload) => {
      const validatedPayload = GetTollsByBoundingBoxPayloadSchema.parse(payload)
      const controller = new AbortController()
      return getTollsByBoundingBox(validatedPayload, controller.signal)
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
