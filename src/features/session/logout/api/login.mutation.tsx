import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { signIn } from './auth.service'
import { signInPayloadSchema } from './payload/auth.payload'
import { AuthResponse, SignInPayload } from '../model'

export function useSignInMutation(
  options: Pick<
    UseMutationOptions<
      AuthResponse,
      DefaultError,
      SignInPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['auth', 'signIn', ...mutationKey],

    mutationFn: async (payload: SignInPayload) => {
      const validatedPayload = signInPayloadSchema.parse(payload)
      const controller = new AbortController()
      return signIn(validatedPayload, controller.signal)
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
