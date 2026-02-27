export enum UserRole {
  PartnerAdmin = 'PartnerAdmin',
  Driver = 'Driver',
  CompanyManager = 'CompanyManager',
  SuperAdmin = 'SuperAdmin',
  SelfDriver = 'SelfDriver',
}

export const isSuperAdmin = (role: string): boolean => {
  return role === UserRole.SuperAdmin
}

export const hasAccessToCompanies = (role: string): boolean => {
  return isSuperAdmin(role)
}
