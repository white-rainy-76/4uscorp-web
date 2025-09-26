'use client'
import { useDictionary } from '@/shared/lib/hooks'
import { createContext, useContext, useEffect, useRef } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

// Создаём контекст для передачи языка в GoogleMapApiProvider
const MapLanguageContext = createContext<string>('en')

export const useMapLanguage = () => useContext(MapLanguageContext)

export const GoogleMapLanguageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { lang } = useDictionary()
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

  // Преобразуем код языка в формат Google Maps
  const language = lang === 'ru' ? 'ru' : 'en'
  const region = language === 'ru' ? 'RU' : 'US'

  return (
    <MapLanguageContext.Provider value={lang}>
      <APIProvider
        apiKey={API_KEY}
        libraries={['marker']}
        language={language}
        region={region}>
        {children}
      </APIProvider>
    </MapLanguageContext.Provider>
  )
}
