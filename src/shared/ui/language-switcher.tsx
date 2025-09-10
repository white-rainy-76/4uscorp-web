'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { useDictionary } from '@/shared/lib/hooks'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

export function LanguageSwitcher() {
  const { lang } = useDictionary()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0]

  const handleLanguageChange = (newLang: string) => {
    if (!pathname) return

    // Обновляем URL с новым языком
    const segments = pathname.split('/')
    if (segments[1] && ['en', 'ru'].includes(segments[1])) {
      // Если уже есть язык в URL, заменяем его
      segments[1] = newLang
    } else {
      // Если нет языка в URL, добавляем его
      segments.splice(1, 0, newLang)
    }
    const newPath = segments.join('/')

    // Сохраняем выбранный язык в cookie
    document.cookie = `locale=${newLang}; path=/; max-age=31536000`

    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-8 px-2 text-sm">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              lang === language.code ? 'bg-accent' : ''
            }`}>
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
