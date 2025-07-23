// import React from 'react'
// import { InfoCard } from '@/shared/ui/info-card'
// import { DriverInfo } from '@/widgets/driver-info'
// import { DriverInfoSkeleton } from '@/widgets/driver-info/ui/driver-info.skeleton'
// import { useDictionary } from '@/shared/lib/hooks'
// import { useTruckData } from '@/shared/store/truck-route-store'

// export const TruckInfoSection = () => {
//   const { dictionary } = useDictionary()
//   const { truck, stats, isLoading } = useTruckData()

//   return (
//     <InfoCard title={dictionary.home.headings.driver_info}>
//       {isLoading ? (
//         <DriverInfoSkeleton />
//       ) : truck ? (
//         <DriverInfo truck={truck} truckInfo={stats} isLoadingFuel={false} />
//       ) : null}
//     </InfoCard>
//   )
// }
