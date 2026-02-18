import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { useAuth as useOidcAuth } from 'react-oidc-context'

interface AuthContextValue {
  getAccessToken: () => Promise<string | null>
  login: () => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  user: { name?: string; email?: string } | null
}

const AuthContext = createContext<AuthContextValue>({
  getAccessToken: () => Promise.resolve(null),
  login: () => {
    // auth not configured
  },
  logout: () => {
    // auth not configured
  },
  isAuthenticated: false,
  isLoading: false,
  user: null,
})

export function AuthGate({ children }: { children: ReactNode }) {
  const auth = useOidcAuth()

  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN
  const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID

  const getAccessToken = useCallback(() => Promise.resolve(auth.user?.access_token ?? null), [auth.user?.access_token])

  const login = useCallback(() => {
    auth.signinRedirect().catch(console.error)
  }, [auth])

  const logout = useCallback(() => {
    auth.removeUser().catch(console.error)
    if (cognitoDomain && cognitoClientId) {
      const logoutUri = window.location.origin
      window.location.href = `${cognitoDomain}/logout?client_id=${cognitoClientId}&logout_uri=${encodeURIComponent(logoutUri)}`
    }
  }, [auth, cognitoDomain, cognitoClientId])

  return (
    <AuthContext.Provider
      value={{
        getAccessToken,
        login,
        logout,
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        user: (auth.user?.profile ?? null) as { name?: string; email?: string } | null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
