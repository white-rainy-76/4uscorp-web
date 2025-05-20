import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { useRef, useCallback } from 'react'
import { cancelDirectionsCreation } from './direction.service'

export function useCancelDirectionsCreationMutation(
  options: Pick<
    UseMutationOptions<void, DefaultError, void, unknown>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options
  const abortControllerRef = useRef<AbortController | null>(null)

  const mutation = useMutation({
    mutationKey: ['directions', 'cancel', ...mutationKey],

    mutationFn: async () => {
      abortControllerRef.current = new AbortController()
      console.log('Starting mutation with new AbortController')
      try {
        const result = await cancelDirectionsCreation(
          abortControllerRef.current.signal,
        )
        console.log('Mutation request completed')
        return result
      } catch (error) {
        console.log('Mutation request failed:', error)
        throw error
      }
    },

    onMutate,

    onSuccess,

    onError,

    onSettled,
  })

  const reset = useCallback(() => {
    console.log('Aborting request')
    abortControllerRef.current?.abort()
    mutation.reset()
  }, [mutation.reset])

  return {
    ...mutation,
    reset,
  }
}
