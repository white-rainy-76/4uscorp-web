import {
  AxelType,
  TollPaymentType,
  TollPriceTimeOfDay,
} from '@/entities/tolls/api'
import type { TollPrice } from '@/entities/tolls/model/types/tolls'

export const TOLL_PAYMENT_TYPE_PRIORITY: TollPaymentType[] = [
  TollPaymentType.PayOnline,
  TollPaymentType.VideoTolls,
  TollPaymentType.Cash,
  TollPaymentType.IPass,
  TollPaymentType.EZPass,
  TollPaymentType.SunPass,
  TollPaymentType.OutOfStateEZPass,
  TollPaymentType.AccountToll,
  TollPaymentType.NonAccountToll,
  TollPaymentType.PalPass,
]

export function getTollPaymentTypeLabel(type: TollPaymentType): string {
  switch (type) {
    case TollPaymentType.PayOnline:
      return 'Pay Online'
    case TollPaymentType.VideoTolls:
      return 'Video Tolls'
    case TollPaymentType.Cash:
      return 'Cash'
    case TollPaymentType.IPass:
      return 'IPass'
    case TollPaymentType.EZPass:
      return 'EZPass'
    case TollPaymentType.SunPass:
      return 'SunPass'
    case TollPaymentType.OutOfStateEZPass:
      return 'Out Of State EZPass'
    case TollPaymentType.AccountToll:
      return 'Account Toll'
    case TollPaymentType.NonAccountToll:
      return 'Non Account Toll'
    case TollPaymentType.PalPass:
      return 'PalPass'
    default:
      return 'Unknown'
  }
}

function isKnownPaymentType(
  value: number | null | undefined,
): value is TollPaymentType {
  if (value == null) return false
  // enum in TS is both ways; numeric membership check via values
  return Object.values(TollPaymentType).includes(value as TollPaymentType)
}

export function getTollPriceAmountFor(
  tollPrices: TollPrice[] | undefined,
  axelType: AxelType,
  paymentType: TollPaymentType,
): number | undefined {
  if (!tollPrices || tollPrices.length === 0) return undefined

  const matches = tollPrices.filter((tp) => {
    if (tp.axelType !== axelType) return false
    if (!isKnownPaymentType(tp.paymentType)) return false
    return tp.paymentType === paymentType
  })

  if (matches.length === 0) return undefined

  // Prefer "Any" (or null) time-of-day entries, then fallback to min amount for determinism.
  const anyTimeMatches = matches.filter(
    (m) => m.timeOfDay == null || m.timeOfDay === TollPriceTimeOfDay.Any,
  )
  const candidates = anyTimeMatches.length > 0 ? anyTimeMatches : matches
  return Math.min(...candidates.map((c) => c.amount))
}

export function getTollPriceAmountWithPriority(
  tollPrices: TollPrice[] | undefined,
  axelType: AxelType,
  preferredPaymentType?: TollPaymentType | null,
): { amount?: number; paymentType?: TollPaymentType } {
  if (preferredPaymentType != null) {
    const amount = getTollPriceAmountFor(
      tollPrices,
      axelType,
      preferredPaymentType,
    )
    if (amount != null) return { amount, paymentType: preferredPaymentType }
  }

  for (const paymentType of TOLL_PAYMENT_TYPE_PRIORITY) {
    const amount = getTollPriceAmountFor(tollPrices, axelType, paymentType)
    if (amount != null) return { amount, paymentType }
  }

  return {}
}

export function getAvailablePaymentTypesForAxles(
  tolls: Array<{
    tollPrices?: TollPrice[] | undefined
    payOnline?: number | undefined
    iPass?: number | undefined
  }>,
  axelType: AxelType,
): TollPaymentType[] {
  const set = new Set<TollPaymentType>()

  for (const toll of tolls) {
    // Prefer tollPrices; but keep backward compatibility with older fields.
    if (toll.tollPrices && toll.tollPrices.length > 0) {
      for (const tp of toll.tollPrices) {
        if (tp.axelType !== axelType) continue
        if (!isKnownPaymentType(tp.paymentType)) continue
        set.add(tp.paymentType)
      }
    } else {
      if ((toll.payOnline ?? 0) > 0) set.add(TollPaymentType.PayOnline)
      if ((toll.iPass ?? 0) > 0) set.add(TollPaymentType.IPass)
    }
  }

  const all = Array.from(set.values())
  const priorityIndex = new Map(
    TOLL_PAYMENT_TYPE_PRIORITY.map((t, idx) => [t, idx]),
  )

  return all.sort((a, b) => {
    const ai = priorityIndex.has(a) ? priorityIndex.get(a)! : 999
    const bi = priorityIndex.has(b) ? priorityIndex.get(b)! : 999
    if (ai !== bi) return ai - bi
    return a - b
  })
}
