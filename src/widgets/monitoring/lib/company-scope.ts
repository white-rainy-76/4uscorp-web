import { Company } from '@/entities/company'

export function getSelectableCompanies(params: {
  clientId: string | null
  allCompanies: Company[]
  childCompanies: Company[]
}): Company[] {
  const { clientId, allCompanies, childCompanies } = params
  if (!clientId) return []

  // If backend returns no children, treat selected client as a "company scope"
  if (childCompanies.length === 0) {
    const self = allCompanies.find((c) => c.id === clientId)
    return self ? [self] : []
  }

  return childCompanies
}

