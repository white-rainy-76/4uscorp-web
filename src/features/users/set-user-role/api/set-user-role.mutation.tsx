import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { setUserRole } from './set-user-role.service'
import { SetUserRolePayload } from './payload/set-user-role.payload'
import { queryClient } from '@/shared/api/query-client'

export function useSetUserRoleMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      SetUserRolePayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['set-user-role', 'set', ...mutationKey],

    mutationFn: async (payload: SetUserRolePayload) => {
      const controller = new AbortController()
      return setUserRole(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()
      await onMutate?.(variables, mutation)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем данные пользователей для получения свежих данных с сервера
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })

      // Инвалидируем конкретного пользователя
      queryClient.invalidateQueries({
        queryKey: ['users', 'user', variables.userId],
      })

      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context, mutation)
    },

    onSettled: (data, error, variables, context, mutation) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context, mutation)
    },
  })
}
