import { useDebounce } from '@/shared/lib/hooks'
import { Input } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { TruckFilters } from '../types'

type TruckListFiltersProps = {
  onChange: (filters: TruckFilters) => void
  initialSearch?: string
  placeholder?: string
}

export const TruckListFilters = ({
  onChange,
  initialSearch = '',
  placeholder,
}: TruckListFiltersProps) => {
  const [search, setSearch] = useState<string | undefined>(initialSearch)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    onChange({ search: debouncedSearch })
  }, [debouncedSearch, onChange])

  return (
    <Input
      showIcon={true}
      placeholder={placeholder}
      value={search ?? ''}
      onChange={(e) => setSearch(e.target.value)}
    />
  )
}
