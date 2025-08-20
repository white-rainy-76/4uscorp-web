# JWT Authentication System

This document describes the JWT authentication system implemented in the 4uscorp-web application.

## Overview

The authentication system provides:

- JWT-based authentication with access tokens
- Automatic token refresh on 403 responses via httpOnly cookies
- Persistent authentication state using Zustand and localStorage
- Protected routes with automatic redirects
- User role and company-based access control

## Architecture

### Components

1. **AuthStore** (`src/shared/store/auth-store.ts`)

   - Zustand store managing authentication state
   - Handles access token storage, user data, and authentication status
   - Persists data to localStorage

2. **AuthProvider** (`src/app/providers/AuthProvider.tsx`)

   - React context provider for authentication
   - Handles app initialization and route protection
   - Manages loading states and redirects

3. **API Interceptors** (`src/shared/api/api.instance.ts`)

   - Automatically adds auth headers to requests
   - Handles 403 responses with automatic token refresh
   - Manages token storage and logout on refresh failure
   - Refresh logic is self-contained (no feature imports)

4. **Storage Utilities** (`src/shared/lib/storage.ts`)

   - Safe localStorage operations with error handling
   - Type-safe storage operations
   - SSR-safe implementation

5. **JWT Utilities** (`src/shared/lib/jwt.ts`)
   - Token decoding and validation
   - User data extraction
   - Expiration checking

## Authentication Flow

### Login Flow

1. User submits credentials via `/auth-api/Auth/login`
2. Backend returns:
   ```json
   {
     "userId": "string",
     "accessToken": "string"
   }
   ```
3. Frontend:
   - Decodes access token to extract user data (role, company_id)
   - Stores access token in localStorage
   - Updates Zustand store
   - Redirects to dashboard

### App Start Flow

1. `AuthProvider` initializes on app load
2. Checks localStorage for existing access token
3. Validates access token with jwt-decode
4. If valid: sets user data in store
5. If invalid: clears tokens and redirects to login

### Token Refresh Flow

1. API request returns 403 (Forbidden)
2. Response interceptor catches the error
3. Calls `/auth-api/Auth/refresh` endpoint (refresh token sent via httpOnly cookie)
4. If successful:
   - Updates access token in localStorage
   - Extracts and updates user data
   - Retries original request
5. If failed:
   - Clears all tokens
   - Redirects to login page

## Usage

### Protected Routes

Wrap components that require authentication:

```tsx
import { ProtectedRoute } from '@/shared/ui/protected-route'

export default function DashboardLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
```

### Authentication State

Use the `useAuth` hook to access authentication state:

```tsx
import { useAuth } from '@/shared/lib/hooks'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) return null

  return (
    <div>
      <p>Welcome, {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Logout

Use the `useLogout` hook:

```tsx
import { useLogout } from '@/shared/lib/hooks'

function LogoutButton() {
  const { logout } = useLogout()

  return <button onClick={logout}>Logout</button>
}
```

## Storage Keys

- `access_token`: JWT access token
- `user_data`: Decoded user information

## Security Features

- Automatic token expiration checking
- Secure token storage in localStorage
- Automatic logout on invalid tokens
- Protected route enforcement
- SSR-safe implementation
- Refresh tokens handled via httpOnly cookies (more secure)

## Error Handling

- Network errors during refresh trigger logout
- Invalid tokens are automatically cleared
- Failed API requests with 403 trigger refresh attempt
- Graceful fallback to login page

## Configuration

The system uses environment variables:

- `NEXT_PUBLIC_SERVER_URL`: Backend API base URL

## Dependencies

- `jwt-decode`: Token decoding
- `zustand`: State management
- `axios`: HTTP client with interceptors
- `next/navigation`: Client-side routing

## Architecture Compliance

- Follows FSD (Feature-Sliced Design) architecture
- No feature imports in shared layer
- Refresh token logic is self-contained in API interceptor
- Clear separation of concerns between layers
