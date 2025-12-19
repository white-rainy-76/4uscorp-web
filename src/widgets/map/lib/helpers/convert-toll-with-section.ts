import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { Toll } from '@/entities/tolls'

export function convertTollWithSectionToToll(
  tollWithSection: TollWithSection,
): Toll {
  return {
    id: tollWithSection.id,
    name: tollWithSection.name || 'Toll',
    price: tollWithSection.price,
    websiteUrl: tollWithSection.websiteUrl ?? null,
    position: {
      lat: tollWithSection.latitude,
      lng: tollWithSection.longitude,
    },
    roadId: tollWithSection.roadId,
    key: tollWithSection.key,
    comment: tollWithSection.comment,
    isDynamic: tollWithSection.isDynamic,
    nodeId: tollWithSection.nodeId,
    payOnline: tollWithSection.payOnline,
    iPass: tollWithSection.iPass,
    iPassOvernight: tollWithSection.iPassOvernight,
    payOnlineOvernight: tollWithSection.payOnlineOvernight,
    routeSection: tollWithSection.routeSection ?? null,
    tag: tollWithSection.tag,
    noPlate: tollWithSection.noPlate,
    cash: tollWithSection.cash,
    noCard: tollWithSection.noCard,
    app: tollWithSection.app,
    tollPrices: tollWithSection.tollPrices,
    isEntry: tollWithSection.isEntry ?? false,
    isExit: tollWithSection.isExit ?? false,
  }
}
