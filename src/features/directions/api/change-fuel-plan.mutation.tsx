import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'

import {
  FuelPlanChangePayload,
  FuelPlanChangeResponse,
} from './types/fuel-plan-change'
import { FuelPlanChangePayloadSchema } from './types/fuel-plan-change'
import { changeFuelPlan } from './fuel-plan-change.service'

export function useChangeFuelPlanMutation(
  options: Pick<
    UseMutationOptions<
      FuelPlanChangeResponse,
      DefaultError,
      FuelPlanChangePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['directions', 'changeFuelPlan', ...mutationKey],

    mutationFn: async (payload: FuelPlanChangePayload) => {
      const validatedPayload = FuelPlanChangePayloadSchema.parse(payload)
      const controller = new AbortController()
      return changeFuelPlan(validatedPayload, controller.signal)
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
