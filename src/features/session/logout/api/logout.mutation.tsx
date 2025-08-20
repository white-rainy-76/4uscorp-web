import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { logout } from './auth.service'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter } from 'next/navigation'

export function useLogoutMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      void,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onError, onSettled } = options
  const { logout: clearAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationKey: ['auth', 'logout', ...mutationKey],

    mutationFn: async () => {
      const controller = new AbortController()
      return logout(controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()
      await onMutate?.(variables)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context) => {
      // Clear local authentication state
      clearAuth()

      // Redirect to login page
      router.push('/auth/sign-in')
    },

    onError: (error, variables, context) => {
      if (context?.abortController) {
        context.abortController.abort('Request cancelled due to error')
      }

      // Even if backend logout fails, clear local state
      clearAuth()
      router.push('/auth/sign-in')

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
