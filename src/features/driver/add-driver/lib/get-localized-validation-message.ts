import { DictionaryType } from '@/shared/config/i18n'

export const getLocalizedValidationMessage = (
  key: string,
  dictionary: DictionaryType,
) => {
  switch (key) {
    case 'name_required':
      return dictionary.home.validation.name_required
    case 'phone_required':
      return dictionary.home.validation.phone_required
    case 'invalid_email':
      return dictionary.home.validation.invalid_email
    case 'invalid_telegram_url':
      return dictionary.home.validation.invalid_telegram_url
    default:
      return key
  }
}
