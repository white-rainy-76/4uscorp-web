import { Partner } from '../../model'
import { PartnerDto } from '../contracts/partner.dto.contract'

export const mapPartner = (raw: PartnerDto): Partner => {
  return {
    partnerId: raw.partnerId,
    userId: raw.userId,
    userName: raw.userName ?? null,
    fullName: raw.fullName ?? null,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    telegramLink: raw.telegramLink ?? null,
    createdAt: raw.createdAt,
  }
}

export const mapPartners = (rawList: PartnerDto[]): Partner[] => {
  return rawList.map(mapPartner)
}
