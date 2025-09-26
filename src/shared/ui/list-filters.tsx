'use client'

import { useDebounce } from '@/shared/lib/hooks'
import { Input } from '@/shared/ui'
import { useEffect, useState } from 'react'

export type ListFilters = {
  search?: string
}

type ListFiltersProps = {
  onChange: (filters: ListFilters) => void
  initialSearch?: string
  placeholder?: string
  className?: string
}

export const ListFilters = ({
  onChange,
  initialSearch = '',
  placeholder = 'Search...',
  className,
}: ListFiltersProps) => {
  const [search, setSearch] = useState<string | undefined>(initialSearch)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    onChange({ search: debouncedSearch })
  }, [debouncedSearch, onChange])

  return (
    <Input
      showIcon
      placeholder={placeholder}
      value={search ?? ''}
      onChange={(e) => setSearch(e.target.value)}
      className={className}
    />
  )
}
