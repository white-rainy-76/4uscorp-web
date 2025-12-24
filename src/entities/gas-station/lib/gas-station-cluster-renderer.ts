import {
  type Marker,
  type Renderer,
  type Cluster,
  type ClusterStats,
} from '@googlemaps/markerclusterer'

/**
 * Кастомный рендерер для кластеров заправок
 * Создает красивые круглые кластеры с градиентом и цифрой внутри
 */
export class GasStationClusterRenderer implements Renderer {
  render(cluster: Cluster, stats: ClusterStats, map: google.maps.Map): Marker {
    const count = cluster.count
    const position = cluster.position

    // Определяем размер и цвет в зависимости от количества заправок
    let size = 40
    let color = '#4285F4' // Синий (мало заправок)
    let borderColor = '#1A73E8'
    let fontSize = '14px'

    if (count > 50) {
      size = 60
      color = '#EA4335' // Красный (много заправок)
      borderColor = '#C5221F'
      fontSize = '16px'
    } else if (count > 20) {
      size = 50
      color = '#FBBC04' // Оранжевый (среднее количество)
      borderColor = '#F9AB00'
      fontSize = '15px'
    } else if (count > 10) {
      size = 45
      color = '#34A853' // Зеленый
      borderColor = '#137333'
    }

    // Создаем контейнер для кластера
    const container = document.createElement('div')
    container.className = 'gas-station-cluster'
    container.style.cssText = `
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `

    // Создаем SVG элемент
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(size))
    svg.setAttribute('height', String(size))
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`)

    // Градиент
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const gradient = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'linearGradient',
    )
    gradient.setAttribute('id', `grad-${count}`)
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '0%')
    gradient.setAttribute('y2', '100%')

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('style', `stop-color:${color};stop-opacity:1`)
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('style', `stop-color:${borderColor};stop-opacity:1`)

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    // Круг с градиентом
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    )
    circle.setAttribute('cx', String(size / 2))
    circle.setAttribute('cy', String(size / 2))
    circle.setAttribute('r', String(size / 2 - 2))
    circle.setAttribute('fill', `url(#grad-${count})`)
    circle.setAttribute('stroke', 'white')
    circle.setAttribute('stroke-width', '3')
    svg.appendChild(circle)
    container.appendChild(svg)

    // Текст с количеством
    const text = document.createElement('div')
    text.textContent = String(count)
    text.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: ${fontSize};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      pointer-events: none;
      user-select: none;
      line-height: 1;
    `
    container.appendChild(text)

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: container,
      zIndex: 1000 + count,
    })
  }
}
