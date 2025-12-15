import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { setCompanyManager } from './set-company-manager.service'
import { SetCompanyManagerPayload } from './payload/set-company-manager.payload'
import { queryClient } from '@/shared/api/query-client'
import { companyQueries } from '@/entities/company'
import { Company } from '@/entities/company'

export function useSetCompanyManagerMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      SetCompanyManagerPayload,
      { abortController: AbortController; previousCompany?: Company }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['set-company-manager', 'set', ...mutationKey],

    mutationFn: async (payload: SetCompanyManagerPayload) => {
      const controller = new AbortController()
      return setCompanyManager(payload, controller.signal)
    },

    onMutate: async (variables, mutation) => {
      const controller = new AbortController()

      // Сохраняем предыдущее состояние компании
      const previousCompany = queryClient.getQueryData<Company>([
        ...companyQueries.all(),
        'company',
        variables.companyId,
      ])

      // Оптимистично обновляем данные компании
      if (previousCompany) {
        const updatedCompany = {
          ...previousCompany,
          companyManagers: [
            {
              id: `temp-${Date.now()}`,
              userId: variables.userId,
              companyId: variables.companyId,
              fullName: 'Новый менеджер', // Временно, будет обновлено с сервера
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...previousCompany.companyManagers,
          ],
        }

        queryClient.setQueryData(
          [...companyQueries.all(), 'company', variables.companyId],
          updatedCompany,
        )
      }

      await onMutate?.(variables, mutation)
      return { abortController: controller, previousCompany }
    },

    onSuccess: async (data, variables, context, mutation) => {
      // Инвалидируем данные компании для получения свежих данных с сервера
      queryClient.invalidateQueries({
        queryKey: [...companyQueries.all(), 'company', variables.companyId],
      })

      await Promise.all([onSuccess?.(data, variables, context, mutation)])
    },

    onError: (error, variables, context, mutation) => {
      // Откатываем оптимистичное обновление при ошибке
      if (context?.previousCompany) {
        queryClient.setQueryData(
          [...companyQueries.all(), 'company', variables.companyId],
          context.previousCompany,
        )
      }

      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context, mutation)
    },

    onSettled: (data, error, variables, context, mutation) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context, mutation)
    },
  })
}
