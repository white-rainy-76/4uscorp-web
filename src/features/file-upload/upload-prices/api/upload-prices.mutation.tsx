import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { uploadFiles } from './file-upload.service'

export function useUploadPricesMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      File[],
      { abortController: AbortController }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['file-upload', 'upload', ...mutationKey],

    mutationFn: async (files: File[]) => {
      const controller = new AbortController()
      return uploadFiles(files, controller.signal)
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
      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context)
    },
  })
}
