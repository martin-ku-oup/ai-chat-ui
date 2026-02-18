import { WebStorageStateStore } from 'oidc-client-ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'
import App from './App.tsx'
import './index.css'
import { AuthGate } from './lib/auth.tsx'

const cognitoRegion = import.meta.env.VITE_COGNITO_REGION
const cognitoUserPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID
const cognitoClientId = import.meta.env.VITE_COGNITO_CLIENT_ID

const cognitoAuthConfig =
  cognitoRegion && cognitoUserPoolId && cognitoClientId
    ? {
        authority: `https://cognito-idp.${cognitoRegion}.amazonaws.com/${cognitoUserPoolId}`,
        client_id: cognitoClientId,
        redirect_uri: window.location.origin,
        response_type: 'code' as const,
        scope: 'email openid phone',
        userStore: new WebStorageStateStore({ store: window.localStorage }),
      }
    : null

function Root() {
  if (cognitoAuthConfig) {
    return (
      <AuthProvider {...cognitoAuthConfig}>
        <AuthGate>
          <App />
        </AuthGate>
      </AuthProvider>
    )
  }
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
