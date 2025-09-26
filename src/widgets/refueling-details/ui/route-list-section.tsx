// import React from 'react'
// import { InfoCard } from '@/shared/ui/info-card'
// import { RouteList } from '@/widgets/refueling-details'
// import { useDictionary } from '@/shared/lib/hooks'
// import { useMapData } from '@/shared/store/truck-route-store'

// export const RouteListSection = () => {
//   const { dictionary } = useDictionary()
//   const { gasStations, selectedRouteId } = useMapData()

//   if (!gasStations.length) return null

//   return (
//     <InfoCard title={dictionary.home.headings.details_info}>
//       <RouteList gasStations={gasStations} selectedRouteId={selectedRouteId} />
//     </InfoCard>
//   )
// }
