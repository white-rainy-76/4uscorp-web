'use client'

import { useEffect } from 'react'
import {
  useRouteFormStore,
  useRouteInfoStore,
  useCartStore,
  useErrorsStore,
} from '@/shared/store'

/**
 * Hook to cleanup all stores on component unmount
 * Clears route form, route info, cart, and errors stores
 */
export function useCleanupStores() {
  const { clearRouteForm } = useRouteFormStore()
  const { clearRouteInfo } = useRouteInfoStore()
  const { clearCart } = useCartStore()
  const { clearAllErrors } = useErrorsStore()

  useEffect(() => {
    return () => {
      clearRouteForm()
      clearRouteInfo()
      clearCart()
      clearAllErrors()
    }
    // Убрали функции-сеттеры из зависимостей, так как они стабильны в Zustand
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
