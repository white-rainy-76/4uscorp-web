import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { signIn } from './auth.service'
import { signInPayloadSchema } from './payload/auth.payload'
import { AuthResponse, SignInPayload } from '../model'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter, usePathname } from 'next/navigation'

export function useSignInMutation(
  options: Pick<
    UseMutationOptions<
      AuthResponse,
      DefaultError,
      SignInPayload,
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onError, onSettled } = options
  const { login } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  return useMutation({
    mutationKey: ['auth', 'signIn', ...mutationKey],

    mutationFn: async (payload: SignInPayload) => {
      const validatedPayload = signInPayloadSchema.parse(payload)
      const controller = new AbortController()
      return signIn(validatedPayload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()
      await onMutate?.(variables, mutation)
      return { abortController: controller }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Login with the access token (refresh token is handled via httpOnly cookies)
      login(data.token)

      // Extract locale from current pathname and redirect to dashboard main page
      const segments = pathname?.split('/') || []
      const locale =
        segments[1] && ['en', 'ru'].includes(segments[1]) ? segments[1] : 'en'

      // Redirect to the main dashboard page with proper locale
      router.push(`/${locale}/(dashboard)/(main)`)
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
