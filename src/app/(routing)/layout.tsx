import { DictionaryProvider } from '@/app/providers'
import { getDictionary } from '@/shared/config/i18n'

interface DictionaryLayoutProps {
  children: React.ReactNode
}

export default async function DictionaryLayout({
  children,
}: Readonly<DictionaryLayoutProps>) {
  return (
    <DictionaryProvider
      lang={'en'}
      initialDictionary={await getDictionary('en')}>
      {children}
    </DictionaryProvider>
  )
}
