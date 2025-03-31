interface ILocale {
  code: string
  name: string
}

export const locales: ILocale[] = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
]

export const defaultLocale = locales[0].code
