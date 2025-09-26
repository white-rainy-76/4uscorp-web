// import React from 'react'
// import { InfoCard } from '@/shared/ui/info-card'
// import { useDictionary } from '@/shared/lib/hooks'
// import { useRouteData, useTruckData } from '@/shared/store/truck-route-store'

// interface RouteInfoSectionProps {
//   routeManager: {
//     startEditing: () => Promise<void>
//     switchToDetailed: () => Promise<void>
//     switchToCurrent: () => void
//   }
// }

// export const RouteInfoSection = ({ routeManager }: RouteInfoSectionProps) => {
//   const { dictionary } = useDictionary()
//   const { truck } = useTruckData()
//   const { routeToDisplay, viewMode, isEditing } = useRouteData()

//   if (!truck || !routeToDisplay) return null

//   return (
//     <InfoCard title={dictionary.home.headings.driver_info}>
//       <TruckRouteInfoRefactored truck={truck} routeManager={routeManager} />
//     </InfoCard>
//   )
// }
