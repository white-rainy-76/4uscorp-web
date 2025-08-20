import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwt, JwtPayload } from '@/shared/lib/jwt'
import { storage, STORAGE_KEYS } from '@/shared/lib/storage'

export interface User {
  userId: string
  role: string
  companyId: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthActions {
  login: (accessToken: string) => void
  logout: () => void
  setAccessToken: (accessToken: string) => void
  updateAccessToken: (accessToken: string) => void
  setLoading: (loading: boolean) => void
  initializeAuth: () => void
  selectCompany: (companyId: string) => void
}

export type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      login: (accessToken: string) => {
        const userData = jwt.extractUserData(accessToken)

        if (userData) {
          set({
            user: userData,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          })

          // Store token and user data in localStorage
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          storage.set(STORAGE_KEYS.USER_DATA, userData)
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        })

        // Clear localStorage
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
        storage.remove(STORAGE_KEYS.USER_DATA)
      },

      setAccessToken: (accessToken: string) => {
        const userData = jwt.extractUserData(accessToken)

        if (userData) {
          set({
            user: userData,
            accessToken,
            isAuthenticated: true,
          })

          // Update localStorage
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          storage.set(STORAGE_KEYS.USER_DATA, userData)
        }
      },

      updateAccessToken: (accessToken: string) => {
        const userData = jwt.extractUserData(accessToken)

        if (userData) {
          set({
            user: userData,
            accessToken,
            isAuthenticated: true,
          })

          // Update localStorage
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          storage.set(STORAGE_KEYS.USER_DATA, userData)
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      selectCompany: (companyId: string) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, companyId }
          set({ user: updatedUser })
          storage.set(STORAGE_KEYS.USER_DATA, updatedUser)
        }
      },

      initializeAuth: () => {
        const accessToken = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN)
        const userData = storage.get<User>(STORAGE_KEYS.USER_DATA)

        if (accessToken && userData && jwt.isValid(accessToken)) {
          set({
            user: userData,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          // Clear invalid data
          if (accessToken || userData) {
            storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
            storage.remove(STORAGE_KEYS.USER_DATA)
          }

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
