import { DictionaryType } from '@/shared/config/i18n'

export const getLocalizedErrorMessage = (
  key: string,
  dictionary: DictionaryType,
) => {
  switch (key) {
    case 'departure':
      return dictionary.home.errors.departure_required_error
    case 'arrival':
      return dictionary.home.errors.destination_required_error
    case 'differentPoints':
      return dictionary.home.errors.different_points
    case 'invalidWeight':
      return dictionary.home.errors.invalid_weight
    case 'invalidFuel':
      return dictionary.home.errors.invalid_fuel
    case 'valid':
      return dictionary.home.errors.valid
    default:
      return key
  }
}
