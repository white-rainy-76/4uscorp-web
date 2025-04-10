type LatLng = [number, number]
export const convertToLatLngLiteral = (
  coords: LatLng[],
): google.maps.LatLngLiteral[] => {
  return coords.map(([lat, lng]) => ({ lat, lng }))
}
