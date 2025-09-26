import {
  Company,
  CompanyDto,
  CompanyManager,
  CompanyManagerDto,
} from '../../model'

export const mapCompany = (rawCompany: CompanyDto): Company => {
  return {
    id: rawCompany.id,
    name: rawCompany.name,
    driversCount: rawCompany.driversCount,
    trucksCount: rawCompany.trucksCount,
    companyManagers: rawCompany.companyManagers.map(mapCompanyManager),
  }
}

export const mapCompanies = (rawCompanies: CompanyDto[]): Company[] => {
  return rawCompanies.map(mapCompany)
}

export const mapCompanyManager = (
  rawCompanyManager: CompanyManagerDto,
): CompanyManager => {
  return {
    id: rawCompanyManager.id,
    userId: rawCompanyManager.userId,
    companyId: rawCompanyManager.companyId,
    fullName: rawCompanyManager.fullName,
    createdAt: rawCompanyManager.createdAt,
    updatedAt: rawCompanyManager.updatedAt,
  }
}
