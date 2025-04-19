import { Loader2 } from 'lucide-react'
import { Button } from './button'
import { useDictionary } from '@/shared/lib/hooks'

export function ButtonLoading() {
  const { dictionary } = useDictionary()
  return (
    <Button disabled>
      <Loader2 className="animate-spin" />
      {dictionary.button.loading}
    </Button>
  )
}
