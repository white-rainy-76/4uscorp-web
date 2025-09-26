import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/sign-in')
  }

  return { logout: handleLogout }
}


