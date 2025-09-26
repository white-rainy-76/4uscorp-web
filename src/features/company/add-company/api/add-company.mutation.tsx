import {
  DefaultError,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { addCompany } from './add-company.service'
import { AddCompanyPayload } from './payload/add-company.payload'
import { queryClient } from '@/shared/api/query-client'
import { companyQueries } from '@/entities/company'
import { Company } from '@/entities/company'

export function useAddCompanyMutation(
  options: Pick<
    UseMutationOptions<
      void,
      DefaultError,
      AddCompanyPayload,
      { abortController: AbortController; newCompany?: Company }
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options

  return useMutation({
    mutationKey: ['add-company', 'add', ...mutationKey],

    mutationFn: async (payload: AddCompanyPayload) => {
      const controller = new AbortController()
      return addCompany(payload, controller.signal)
    },

    onMutate: async (variables) => {
      const controller = new AbortController()

      // Создаем временный ID для новой компании
      const tempId = `temp-${Date.now()}`

      // Создаем новый объект компании
      const newCompany: Company = {
        id: tempId,
        name: variables.name,
        driversCount: 0,
        trucksCount: 0,
        companyManagers: [],
      }

      // Оптимистично добавляем компанию в список
      const previousCompanies = queryClient.getQueryData(companyQueries.lists())

      if (previousCompanies) {
        queryClient.setQueryData(companyQueries.lists(), [
          newCompany,
          ...(previousCompanies as Company[]),
        ])
      }

      await onMutate?.(variables)
      return { abortController: controller, newCompany }
    },

    onSuccess: async (data, variables, context) => {
      // Инвалидируем список компаний для получения свежих данных с сервера
      queryClient.invalidateQueries({
        queryKey: companyQueries.lists(),
      })

      await Promise.all([onSuccess?.(data, variables, context)])
    },

    onError: (error, variables, context) => {
      // Откатываем оптимистичное добавление при ошибке
      if (context?.newCompany) {
        const previousCompanies = queryClient.getQueryData(
          companyQueries.lists(),
        )

        if (previousCompanies) {
          const filteredCompanies = (previousCompanies as Company[]).filter(
            (company) => company.id !== context.newCompany!.id,
          )

          queryClient.setQueryData(companyQueries.lists(), filteredCompanies)
        }
      }

      context?.abortController?.abort('Request cancelled due to error')
      onError?.(error, variables, context)
    },

    onSettled: (data, error, variables, context) => {
      context?.abortController?.abort('Request settled')
      onSettled?.(data, error, variables, context)
    },
  })
}
