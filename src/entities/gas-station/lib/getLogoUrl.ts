export const getLogoUrl = (name: string | undefined): string => {
  if (!name) return '/images/default.png'
  const firstName = name.split(' ')[0].toLowerCase()

  switch (firstName) {
    case 'pilot':
      return '/images/pilot.png'
    case 'flying':
      return '/images/flyingj.png'
    case 'speedway':
      return '/images/speedway.png'
    case 'mr.':
      return '/images/mrfuel.png'
    case 'loves':
      return '/images/loves.png'
    case 'road':
      return '/images/roadranger.png'
    case 'ta':
      return '/images/TA.png'
    case 'petro':
      return '/images/petro.png'
    case 'compass':
      return '/images/compass.png'
    case 'sapp':
      return '/images/sapbros.png'
    case 'the': // Исключение для "The Pantry"
      return '/images/pilot.png'
    case 'all': // Исключение для "All American"
      return '/images/pilot.png'
    default:
      return '/images/default.png' // Логотип по умолчанию, если не найдено соответствие
  }
}
