// 'use client'

// import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { useMap } from '@vis.gl/react-google-maps'
// import { MarkerClusterer } from '@googlemaps/markerclusterer'
// import { GasStationMarker } from './gas-station-marker'
// import { GasStation } from '../model/gas-station'

// type Props = {
//   gasStations: GasStation[]
// }

// export const ClusteredGasStationMarkers: React.FC<Props> = ({
//   gasStations,
// }) => {
//   const [markers, setMarkers] = useState<{
//     [key: string]: google.maps.marker.AdvancedMarkerElement
//   }>({})
//   const map = useMap()

//   const clusterer = useMemo(() => {
//     if (!map) return null

//     return new MarkerClusterer({
//       map,
//       renderer: {
//         render({ count, position, markers }) {
//           const hasAlgorithmStation = markers?.some(
//             (marker: any) => marker.gasStation?.isAlgorithm,
//           )

//           return new google.maps.Marker({
//             position,
//             icon: {
//               url: hasAlgorithmStation
//                 ? '/cluster-algorithm.svg'
//                 : '/cluster-default.svg',
//               scaledSize: new google.maps.Size(50, 50),
//               labelOrigin: new google.maps.Point(25, 28),
//             },
//             label: {
//               text: String(count),
//               color: hasAlgorithmStation ? '#f59e0b' : '#374151',
//               fontSize: '14px',
//               fontWeight: 'bold',
//             },
//             zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
//           })
//         },
//       },
//     })
//   }, [map])

//   useEffect(() => {
//     if (!clusterer) return
//     clusterer.clearMarkers()
//     clusterer.addMarkers(Object.values(markers))
//   }, [clusterer, markers])

//   const setMarkerRef = useCallback(
//     (
//       marker: google.maps.marker.AdvancedMarkerElement | null,
//       gasStation: GasStation,
//     ) => {
//       setMarkers((current) => {
//         const id = gasStation.id
//         if ((marker && current[id]) || (!marker && !current[id])) return current

//         if (marker) {
//           // 👇 Кладем саму заправку на маркер для работы с кластеризацией
//           ;(marker as any).gasStation = gasStation
//           return { ...current, [id]: marker }
//         } else {
//           const { [id]: _, ...rest } = current
//           return rest
//         }
//       })
//     },
//     [],
//   )

//   return (
//     <>
//       {gasStations.map((station) => (
//         <GasStationMarker
//           key={station.id}
//           gasStation={station}
//           setMarkerRef={setMarkerRef}
//         />
//       ))}
//     </>
//   )
// }
