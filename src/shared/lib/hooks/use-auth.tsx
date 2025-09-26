import { useAuthStore } from '@/shared/store/auth-store'

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAccessToken,
    updateAccessToken,
    setLoading,
    initializeAuth,
  } = useAuthStore()

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAccessToken,
    updateAccessToken,
    setLoading,
    initializeAuth,
  }
}
