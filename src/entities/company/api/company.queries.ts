import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getAllCompanies, getCompanyById } from './company.service'
import { mapCompanies, mapCompany } from './mapper/company.mapper'

export const COMPANIES_ROOT_QUERY_KEY = ['companies']

export const companyQueries = {
  all: () => [...COMPANIES_ROOT_QUERY_KEY],

  lists: () => [...companyQueries.all(), 'list'],

  list: () =>
    queryOptions({
      queryKey: companyQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getAllCompanies({ signal })
        const companies = mapCompanies(data)
        return companies
      },
      placeholderData: keepPreviousData,
    }),

  company: (id: string) =>
    queryOptions({
      queryKey: [...COMPANIES_ROOT_QUERY_KEY, 'company', id],
      queryFn: async ({ signal }) => {
        const { data } = await getCompanyById(id, { signal })
        const company = mapCompany(data)
        return company
      },
    }),
}
