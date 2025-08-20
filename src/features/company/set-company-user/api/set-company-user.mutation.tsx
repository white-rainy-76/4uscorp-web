import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { setCompanyUser } from './set-company-user.service'
import { SetCompanyUserPayload } from './payload/set-company-user.payload'
import { SetCompanyUserResponse } from '../model'
import { useAuthStore } from '@/shared/store/auth-store'

export function useSetCompanyUserMutation(
  options: Pick<
    UseMutationOptions<
      SetCompanyUserResponse,
      DefaultError,
      SetCompanyUserPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['set-company-user', 'set', ...mutationKey],

    mutationFn: async (payload: SetCompanyUserPayload) => {
      const controller = new AbortController()
      return setCompanyUser(payload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()
      await onMutate?.(variables)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context) => {
      // Обновляем токен в auth store
      if (data) {
        useAuthStore.getState().updateAccessToken(data)
      }

      await Promise.all([onSuccess?.(data, variables, context)])
    },

    onError: (error, variables, context) => {
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context)
    },
  })
}
