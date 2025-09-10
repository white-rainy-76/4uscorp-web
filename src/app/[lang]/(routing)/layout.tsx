import { DictionaryProvider } from '@/app/providers'
import { getDictionary } from '@/shared/config/i18n'
import { locales } from '@/shared/config/i18n'

interface DictionaryLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export default async function DictionaryLayout({
  children,
  params,
}: Readonly<DictionaryLayoutProps>) {
  const { lang } = await params

  if (!locales.some((locale) => locale.code === lang)) {
    const defaultLang = 'en'
    return (
      <DictionaryProvider
        lang={defaultLang}
        initialDictionary={await getDictionary(defaultLang)}>
        {children}
      </DictionaryProvider>
    )
  }

  return (
    <DictionaryProvider
      lang={lang}
      initialDictionary={await getDictionary(lang)}>
      {children}
    </DictionaryProvider>
  )
}
