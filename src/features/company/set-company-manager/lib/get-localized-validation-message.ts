import { DictionaryType } from '@/shared/config/i18n'

export const getLocalizedValidationMessage = (
  key: string,
  dictionary: DictionaryType,
) => {
  switch (key) {
    case 'invalid_user_id':
      return dictionary.home.validation.invalid_user_id
    case 'invalid_company_id':
      return dictionary.home.validation.invalid_company_id
    default:
      return key
  }
}
