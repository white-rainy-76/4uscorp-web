import { jwtDecode } from 'jwt-decode'

export interface JwtPayload {
  sub: string
  role: string
  company_id: string
  exp: number
  iat: number
  [key: string]: any
}

export const jwt = {
  decode: (token: string): JwtPayload | null => {
    try {
      return jwtDecode<JwtPayload>(token)
    } catch (error) {
      console.error('Error decoding JWT token:', error)
      return null
    }
  },

  isExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  },

  isValid: (token: string): boolean => {
    if (!token) return false
    
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp > currentTime
    } catch (error) {
      return false
    }
  },

  extractUserData: (token: string) => {
    const decoded = jwt.decode(token)
    if (!decoded) return null

    return {
      userId: decoded.sub,
      role: decoded.role,
      companyId: decoded.company_id
    }
  }
}


