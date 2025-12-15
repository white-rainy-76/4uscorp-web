import React, { useMemo } from 'react'
import { Toll } from '@/entities/tolls'
import {
  AxelType,
  TollPaymentType,
  TollPriceDayOfWeek,
  TollPriceTimeOfDay,
} from '@/entities/tolls/api'
import {
  getTollPaymentTypeLabel,
  TOLL_PAYMENT_TYPE_PRIORITY,
} from '@/entities/tolls/lib/toll-pricing'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Badge } from '@/shared/ui/badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  toll: Toll | null
}

function formatAxles(axelType: number): string {
  if (axelType === AxelType._5L) return '5'
  if (axelType === AxelType._6L) return '6'
  if (axelType === AxelType.Unknown) return '-'
  // fallback for other classes if backend sends them
  return String(axelType)
}

function formatTimeOfDay(timeOfDay: number | null | undefined): string {
  if (timeOfDay == null || timeOfDay === TollPriceTimeOfDay.Any) return 'Any'
  if (timeOfDay === TollPriceTimeOfDay.Day) return 'Day'
  if (timeOfDay === TollPriceTimeOfDay.Night) return 'Night'
  return String(timeOfDay)
}

function formatDayOfWeek(day: number | null | undefined): string {
  switch (day) {
    case TollPriceDayOfWeek.Monday:
      return 'Mon'
    case TollPriceDayOfWeek.Tuesday:
      return 'Tue'
    case TollPriceDayOfWeek.Wednesday:
      return 'Wed'
    case TollPriceDayOfWeek.Thursday:
      return 'Thu'
    case TollPriceDayOfWeek.Friday:
      return 'Fri'
    case TollPriceDayOfWeek.Saturday:
      return 'Sat'
    case TollPriceDayOfWeek.Sunday:
      return 'Sun'
    case TollPriceDayOfWeek.Any:
    case null:
    case undefined:
      return 'Any'
    default:
      return String(day)
  }
}

function formatDaysRange(
  from: number | null | undefined,
  to: number | null | undefined,
): string {
  const f = formatDayOfWeek(from)
  const t = formatDayOfWeek(to)
  if (f === 'Any' && t === 'Any') return 'Any'
  if (f === t) return f
  return `${f}–${t}`
}

function normalizeTimeString(value: string | null | undefined): string | null {
  if (!value) return null
  // API can return "HH:mm:ss" (TimeOnly) or "HH:mm"
  const m = value.match(/^(\d{2}):(\d{2})(?::\d{2})?/)
  if (!m) return value
  return `${m[1]}:${m[2]}`
}

function isAllDayTimeRange(
  timeFrom: string | null | undefined,
  timeTo: string | null | undefined,
): boolean {
  const from = normalizeTimeString(timeFrom)
  const to = normalizeTimeString(timeTo)

  // If both absent, treat as "all day"
  if (!from && !to) return true

  // TimeOnly default (00:00:00) often means "no restriction" on time range
  if (from === '00:00' && (!to || to === '00:00')) return true

  // Some APIs use end-of-day.
  if (from === '00:00' && (to === '23:59' || to === '23:59')) return true

  return false
}

function formatTimeRange(
  timeFrom: string | null | undefined,
  timeTo: string | null | undefined,
): string {
  if (isAllDayTimeRange(timeFrom, timeTo)) return 'All day'
  const from = normalizeTimeString(timeFrom)
  const to = normalizeTimeString(timeTo)
  if (from && to) return `${from}–${to}`
  if (from && !to) return `from ${from}`
  if (!from && to) return `until ${to}`
  return 'All day'
}

function paymentTypeOrder(paymentType: number | null | undefined): number {
  if (paymentType == null) return 999
  const idx = TOLL_PAYMENT_TYPE_PRIORITY.indexOf(paymentType as TollPaymentType)
  return idx === -1 ? 998 : idx
}

export const TollPricesSheet = ({ open, onOpenChange, toll }: Props) => {
  const rows = useMemo(() => {
    const tollPrices = toll?.tollPrices ?? []

    return [...tollPrices].sort((a, b) => {
      const pa = paymentTypeOrder(a.paymentType)
      const pb = paymentTypeOrder(b.paymentType)
      if (pa !== pb) return pa - pb

      if (a.axelType !== b.axelType) return a.axelType - b.axelType

      const ta = a.timeOfDay ?? TollPriceTimeOfDay.Any
      const tb = b.timeOfDay ?? TollPriceTimeOfDay.Any
      if (ta !== tb) return ta - tb

      const da = a.dayOfWeekFrom ?? TollPriceDayOfWeek.Any
      const db = b.dayOfWeekFrom ?? TollPriceDayOfWeek.Any
      if (da !== db) return da - db

      const fa = normalizeTimeString(a.timeFrom) ?? ''
      const fb = normalizeTimeString(b.timeFrom) ?? ''
      return fa.localeCompare(fb)
    })
  }, [toll])

  const paymentMethodBadges = useMemo(() => {
    const pm = toll?.paymentMethod
    if (!pm) return []
    const items: Array<{ key: string; label: string; enabled: boolean }> = [
      { key: 'tag', label: 'Tag', enabled: !!pm.tag },
      { key: 'app', label: 'App', enabled: !!pm.app },
      { key: 'cash', label: 'Cash', enabled: !!pm.cash },
      { key: 'noPlate', label: 'No plate', enabled: !!pm.noPlate },
      { key: 'noCard', label: 'No card', enabled: !!pm.noCard },
    ]
    return items.filter((i) => i.enabled)
  }, [toll])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[740px] sm:max-w-[740px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 pb-3">
            <SheetTitle className="text-text-heading">
              {toll?.name ?? 'Toll'}
            </SheetTitle>
            {/* SheetDescription renders <p>, so we use asChild to avoid invalid <p><div/></p> nesting */}
            <SheetDescription asChild>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {toll?.key ? (
                    <Badge variant="secondary">key: {toll.key}</Badge>
                  ) : null}
                  {toll?.roadId ? (
                    <Badge variant="secondary">roadId: {toll.roadId}</Badge>
                  ) : null}
                  {toll?.isDynamic ? <Badge>dynamic</Badge> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {paymentMethodBadges.length > 0 ? (
                    paymentMethodBadges.map((b) => (
                      <Badge key={b.key} variant="outline">
                        {b.label}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Payment methods: -
                    </span>
                  )}
                </div>

                {toll?.websiteUrl && (
                  <div className="pt-1">
                    <a
                      href={toll.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline break-all">
                      {toll.websiteUrl}
                    </a>
                  </div>
                )}
              </div>
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 pb-3 text-sm font-semibold text-text-heading">
            Prices
          </div>

          <div className="flex-1 px-3 pb-3">
            <ScrollArea className="h-full rounded-md border">
              <div className="min-w-[760px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background border-b">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-semibold text-text-heading">
                        Payment
                      </th>
                      <th className="px-3 py-2 font-semibold text-text-heading">
                        Axles
                      </th>
                      <th className="px-3 py-2 font-semibold text-text-heading">
                        Time of day
                      </th>
                      <th className="px-3 py-2 font-semibold text-text-heading">
                        Days
                      </th>
                      <th className="px-3 py-2 font-semibold text-text-heading">
                        Time
                      </th>
                      <th className="px-3 py-2 font-semibold text-text-heading">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {toll && rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-6 text-center text-muted-foreground">
                          No prices for this toll
                        </td>
                      </tr>
                    ) : (
                      rows.map((p) => (
                        <tr key={p.id} className="border-b last:border-b-0">
                          <td className="px-3 py-2 text-text-heading">
                            {getTollPaymentTypeLabel(
                              (p.paymentType ??
                                TollPaymentType.Unknown) as TollPaymentType,
                            )}
                          </td>
                          <td className="px-3 py-2 text-text-heading">
                            {formatAxles(p.axelType)}
                          </td>
                          <td className="px-3 py-2 text-text-heading">
                            {formatTimeOfDay(p.timeOfDay)}
                          </td>
                          <td className="px-3 py-2 text-text-heading">
                            {formatDaysRange(p.dayOfWeekFrom, p.dayOfWeekTo)}
                          </td>
                          <td className="px-3 py-2 text-text-heading">
                            {formatTimeRange(p.timeFrom, p.timeTo)}
                          </td>
                          <td className="px-3 py-2 font-semibold tabular-nums text-text-heading">
                            ${p.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
