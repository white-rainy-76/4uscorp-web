import { DictionaryType } from '@/shared/config/i18n'

export const getLocalizedValidationMessage = (
  key: string,
  dictionary: DictionaryType,
) => {
  switch (key) {
    case 'company_name_required':
      return dictionary.home.validation.company_name_required
    case 'samsara_token_required':
      return dictionary.home.validation.samsara_token_required
    default:
      return key
  }
}
