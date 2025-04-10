import { useRouteStore } from '@/shared/store/route-store'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import React, { useEffect, useState } from 'react'

export const DirectionsOld = () => {
  const map = useMap()
  const { origin, destination } = useRouteStore()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>()
  const [mainRenderer, setMainRenderer] =
    useState<google.maps.DirectionsRenderer>()
  const [altRenderers, setAltRenderers] = useState<
    google.maps.DirectionsRenderer[]
  >([])
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
  const [routeIndex, setRouteIndex] = useState(0)

  const selectedRoute = routes[routeIndex]
  const leg = selectedRoute?.legs[0]

  const mainColor = '#2c2cea'
  const altColors = [
    '#e538359f',
    '#43A047',
    '#ffb300af',
    '#9b27b09d',
    '#00abc1ab',
  ]

  // Initialize the directions service
  useEffect(() => {
    if (!routesLibrary) return
    setDirectionsService(new routesLibrary.DirectionsService())
  }, [routesLibrary])

  // Clear all renderers
  const clearAllRenderers = () => {
    if (mainRenderer) {
      mainRenderer.setMap(null)
      setMainRenderer(undefined)
    }

    altRenderers.forEach((renderer) => renderer.setMap(null))
    setAltRenderers([])
  }

  // Fetch and display routes
  useEffect(() => {
    if (!directionsService || !map || !routesLibrary || !origin || !destination)
      return

    // Clear previous renderers
    clearAllRenderers()

    directionsService
      .route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        setRoutes(response.routes)
        console.log(response)
        // Create the main renderer for the selected route
        const newMainRenderer = new routesLibrary.DirectionsRenderer({
          directions: response,
          routeIndex: routeIndex,
          map,
          polylineOptions: {
            strokeColor: mainColor,
            strokeOpacity: 1.0,
            strokeWeight: 4,
          },
          // Disable dragging
          draggable: false,
        })
        setMainRenderer(newMainRenderer)

        // Create renderers for alternative routes
        const newAltRenderers = response.routes
          .map((_, index) => {
            if (index === routeIndex) return null // Skip the main route

            return new routesLibrary.DirectionsRenderer({
              directions: response,
              routeIndex: index,
              map,
              polylineOptions: {
                strokeColor: altColors[index % altColors.length],
                strokeOpacity: 0.7,
                strokeWeight: 3,
              },
              suppressMarkers: true,
              preserveViewport: true,
            })
          })
          .filter(Boolean) as google.maps.DirectionsRenderer[]

        setAltRenderers(newAltRenderers)
      })
      .catch((error) => {
        console.error('Error fetching routes:', error)
      })
  }, [directionsService, map, routesLibrary, origin, destination])

  // Update on route index change
  useEffect(() => {
    if (!mainRenderer || !map || !routesLibrary || routes.length === 0) return

    // Clear all renderers
    clearAllRenderers()

    // Get the current directions result
    const directions = mainRenderer.getDirections()
    if (!directions) return

    // Create a new main renderer
    const newMainRenderer = new routesLibrary.DirectionsRenderer({
      directions: directions,
      routeIndex: routeIndex,
      map,
      polylineOptions: {
        strokeColor: mainColor,
        strokeOpacity: 1.0,
        strokeWeight: 4,
      },
      draggable: false,
    })
    setMainRenderer(newMainRenderer)

    // Create new renderers for alternative routes
    const newAltRenderers = directions.routes
      .map((_, index) => {
        if (index === routeIndex) return null // Skip the main route

        return new routesLibrary.DirectionsRenderer({
          directions: directions,
          routeIndex: index,
          map,
          polylineOptions: {
            strokeColor: altColors[index % altColors.length],
            strokeOpacity: 0.7,
            strokeWeight: 3,
          },
          suppressMarkers: true,
          // preserveViewport: true,
        })
      })
      .filter(Boolean) as google.maps.DirectionsRenderer[]

    setAltRenderers(newAltRenderers)
  }, [routeIndex, map, routesLibrary])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      clearAllRenderers()
    }
  }, [])

  // Route change handler
  const handleRouteChange = (index: number) => {
    setRouteIndex(index)
  }

  if (!leg) return null

  return (
    <div className="directions p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{selectedRoute?.summary}</h2>
      <>
        <p className="mb-1">
          {leg.start_address?.split(',')[0]} → {leg.end_address?.split(',')[0]}
        </p>
        <p className="mb-1">Distance: {leg.distance?.text}</p>
        <p className="mb-3">Duration: {leg.duration?.text}</p>
      </>

      <h3 className="text-lg font-semibold mt-4 mb-2">Alternative Routes</h3>
      <ul className="space-y-2">
        {routes.map((route, index) => (
          <li key={`route-${index}`}>
            <button
              onClick={() => handleRouteChange(index)}
              className={`flex w-full text-left p-2 rounded ${
                index === routeIndex
                  ? 'bg-gray-100 font-medium'
                  : 'hover:bg-gray-50'
              }`}
              style={{
                borderLeft: `4px solid ${
                  index === routeIndex
                    ? mainColor
                    : altColors[index % altColors.length]
                }`,
              }}>
              <div>
                <div className="font-medium">{route.summary}</div>
                <div className="text-sm text-gray-600">
                  {route.legs[0].distance?.text} ·{' '}
                  {route.legs[0].duration?.text}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
