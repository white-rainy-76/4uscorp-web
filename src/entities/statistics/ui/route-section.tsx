'use client'

import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import { Icon, RouteIndicator } from '@/shared/ui'
import { FuelStationStatusType } from '@/entities/route/model/types/fuel-station-status'
import { getLogoUrl } from '@/entities/gas-station'
import { useDictionary } from '@/shared/lib/hooks'
import { FuelRouteInfo, FuelPlanStation } from '../model/types/statistics'

interface RouteSectionProps {
  routeInfo: FuelRouteInfo
  gasStations: FuelPlanStation[]
}

/**
 * Main RouteSection component that displays route information and gas stations
 * Shows route header, route info, and list of gas stations with fuel details
 */
export function RouteSection({ routeInfo, gasStations }: RouteSectionProps) {
  const truckWeight = 45000 // Default truck weight (not in schema)

  return (
    <div className="border border-border rounded-lg p-6 space-y-6">
      {/* Route header and route information */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <RouteHeader routeInfo={routeInfo} truckWeight={truckWeight} />
        <RouteInfo routeInfo={routeInfo} />
      </div>

      {/* Gas stations information */}
      <div className="mt-[30px]">
        <div className="flex gap-6">
          <div className="mt-3">
            <RouteIndicator
              pointCount={gasStations.length}
              fuelStationStatuses={gasStations.reduce(
                (acc, station) => {
                  acc[station.fuelStationId] =
                    station.status as FuelStationStatusType
                  return acc
                },
                {} as { [fuelStationId: string]: FuelStationStatusType },
              )}
              gasStationIds={gasStations.map((s) => s.fuelStationId)}
            />
          </div>

          <div className="flex flex-col space-y-6 w-full">
            {gasStations.map((station) => (
              <GasStationItem key={station.fuelStationId} station={station} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface RouteHeaderProps {
  routeInfo: RouteSectionProps['routeInfo']
  truckWeight: number
}

/**
 * RouteHeader component displays the origin-destination route information
 * Shows route path, start date, and truck weight
 */
function RouteHeader({ routeInfo, truckWeight }: RouteHeaderProps) {
  const { dictionary } = useDictionary()
  const displayOrigin = routeInfo.originName
  const displayDestination = routeInfo.destinationName
  const isRoute = true

  return (
    <div className="space-y-2">
      {isRoute ? (
        <>
          {/* Origin to destination route display */}
          <div className="bg-input-bg rounded-full px-4 py-1 text-base h-[44px] text-text-neutral font-extrabold flex items-center gap-2">
            {displayOrigin} <span className="text-xl">→</span>{' '}
            {displayDestination}
          </div>
          {/* Date and weight information */}
          <div className="text-muted-foreground text-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {format(new Date(routeInfo.startDate), 'yyyy/MM/dd')}
            </div>
            <div className="flex items-center gap-2">
              <Icon name="common/weight" width={16} height={16} />
              <span className="font-semibold text-black">
                {truckWeight?.toLocaleString()}{' '}
                {dictionary.home.statistics.pounds_unit}
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Single location display */}
          <div className="bg-muted rounded-full px-4 py-1 text-sm h-[44px] text-text-neutral flex items-center gap-2">
            {displayOrigin}
          </div>
          <div className="text-muted-foreground text-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {format(new Date(routeInfo.startDate), 'yyyy/MM/dd')}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface RouteInfoProps {
  routeInfo: RouteSectionProps['routeInfo']
}

/**
 * RouteInfo component displays route statistics
 * Shows drive time, miles, gallons, and tolls information
 */
function RouteInfo({ routeInfo }: RouteInfoProps) {
  const { dictionary } = useDictionary()

  // Format drive time from hours to hours and minutes
  const hours = Math.floor(routeInfo.driveTime)
  const minutes = Math.round((routeInfo.driveTime - hours) * 60)
  const displayDriveTime = `${hours}${dictionary.home.statistics.hours_unit} ${minutes}${dictionary.home.statistics.minutes_unit}`

  const displayMiles = `${routeInfo.totalDistance}${dictionary.home.statistics.miles_unit}`
  const displayGallons = routeInfo.gallons.toString()
  const displayTolls = `$${routeInfo.tolls}`

  return (
    <div className="flex gap-x-[25px] text-sm text-text-neutral font-semibold">
      {/* Drive time column */}
      <div className="flex flex-col items-start gap-[15px]">
        <span className="font-normal">
          {dictionary.home.route_panel.drive_time}
        </span>
        <span className="font-bold whitespace-nowrap">{displayDriveTime}</span>
      </div>
      {/* Miles column */}
      <div className="flex flex-col items-start gap-[15px]">
        <span className="font-normal">{dictionary.home.route_panel.miles}</span>
        <span className="font-bold whitespace-nowrap">{displayMiles}</span>
      </div>
      {/* Gallons column */}
      <div className="flex flex-col items-start gap-[15px]">
        <span className="font-normal">
          {dictionary.home.route_panel.gallons}
        </span>
        <span className="font-bold whitespace-nowrap">{displayGallons}</span>
      </div>
      {/* Tolls column */}
      <div className="flex flex-col items-start gap-[15px]">
        <span className="font-normal">{dictionary.home.route_panel.tolls}</span>
        <span className="font-bold whitespace-nowrap">{displayTolls}</span>
      </div>
    </div>
  )
}

interface GasStationItemProps {
  station: RouteSectionProps['gasStations'][0]
}

/**
 * GasStationItem component displays a single gas station with fuel, address, and price information
 * Combines FuelBlock, StationInfo, and PriceBlock components
 */
function GasStationItem({ station }: GasStationItemProps) {
  return (
    <div className="flex items-center w-full">
      <FuelBlock station={station} />
      <StationInfo station={station} />
      <PriceBlock station={station} />
    </div>
  )
}

interface FuelBlockProps {
  station: RouteSectionProps['gasStations'][0]
}

/**
 * Get color classes based on station status
 * Status 0 - gray, Status 1 - green, Status 2 - red, Status 3 - gray
 */
function getStatusColor(status: number): {
  text: string
  icon: 'common/fuel' | 'common/fuel-green' | 'common/fuel-red'
} {
  switch (status) {
    case 1:
      return {
        text: 'text-[#2AC78A]',
        icon: 'common/fuel-green',
      }
    case 2:
      return {
        text: 'text-[#D84949]',
        icon: 'common/fuel-red',
      }
    case 0:
    case 3:
    default:
      return {
        text: 'text-gray-500',
        icon: 'common/fuel',
      }
  }
}

/**
 * FuelBlock component displays fuel information for a gas station
 * Shows planned refill amount and actual refill with color-coded status
 * Includes S and W labels for actual and WEX refill amounts
 */
function FuelBlock({ station }: FuelBlockProps) {
  const { dictionary } = useDictionary()
  const statusColor = getStatusColor(station.status)

  return (
    <div className="w-fit h-[62px] border border-dashed rounded-md py-1.5 px-2.5 flex items-center">
      <div className="flex gap-2 items-center">
        {/* Plan Refill Block */}
        <div className="flex items-center gap-2">
          <Icon name="common/fuel" width={26} height={31} />
          <div className="leading-tight">
            <div className="font-extrabold text-sm text-text-strong">
              {station.planRefillGl}
            </div>
            <div className="text-xs text-text-muted-alt">
              {dictionary.home.statistics.gallons_unit}
            </div>
          </div>
        </div>

        {/* Actual Refill Block */}
        <div className="flex items-start gap-2">
          <Icon name={statusColor.icon} width={26} height={31} />
          <div className="leading-tight relative">
            <div className="flex items-center gap-1">
              {/* Fuel before refill amount */}
              <span className={`font-extrabold text-sm ${statusColor.text}`}>
                {station.fuelBeforeRefillGl}
              </span>
              <span className={statusColor.text}>|</span>

              {/* Actual refill amount with S label */}
              <div className="relative">
                <span className={`font-extrabold text-sm ${statusColor.text}`}>
                  {station.actualRefillGl}
                </span>
                <span
                  className={`absolute -top-[12px] left-1/2 transform -translate-x-1/2 font-nunito font-normal text-sm leading-none tracking-wider ${statusColor.text}`}>
                  {dictionary.home.statistics.s_label.toLowerCase()}
                </span>
              </div>

              <span className={statusColor.text}>|</span>

              {/* WEX refill amount with W label */}
              <div className="relative">
                <span className={`font-extrabold text-sm ${statusColor.text}`}>
                  {station.wexRefillGl}
                </span>
                <span
                  className={`absolute -top-[12px] left-1/2 transform -translate-x-1/2 font-nunito font-normal text-sm leading-none tracking-wider ${statusColor.text}`}>
                  {dictionary.home.statistics.w_label.toLowerCase()}
                </span>
              </div>
            </div>
            <div className={`text-xs ${statusColor.text}`}>
              {dictionary.home.statistics.gallons_unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StationInfoProps {
  station: RouteSectionProps['gasStations'][0]
}

/**
 * StationInfo component displays gas station information
 * Shows station logo and address
 */
function StationInfo({ station }: StationInfoProps) {
  const { dictionary } = useDictionary()

  return (
    <div className="flex-[3] flex items-center gap-3">
      <div className="w-12 flex items-center justify-center">
        <Image
          alt="gas-station"
          src={getLogoUrl(station.provider)}
          width={28}
          height={28}
          className="mx-auto"
        />
      </div>
      <div className="text-sm leading-tight space-y-[2px]">
        <div className="text-xs text-text-muted">
          {dictionary.home.route_panel.address}
        </div>
        <div className="text-xs font-bold text-text-heading">
          {station.address}
        </div>
      </div>
    </div>
  )
}

interface PriceBlockProps {
  station: RouteSectionProps['gasStations'][0]
}

/**
 * PriceBlock component displays fuel price information
 * Shows price with dollar icon
 */
function PriceBlock({ station }: PriceBlockProps) {
  const { dictionary } = useDictionary()

  return (
    <div className="flex-1 max-w-[172px] border border-dashed rounded-md py-1.5 px-2.5 flex gap-3">
      <Icon name="common/dollar" width={15.5} height={31} />
      <div className="flex flex-col leading-tight space-y-[2px]">
        <div className="font-extrabold text-sm text-text-strong">
          ${station.price}
        </div>
        <div className="text-xs text-text-muted-alt">
          {dictionary.home.details_info.price}
        </div>
      </div>
    </div>
  )
}
