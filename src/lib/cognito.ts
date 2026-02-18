import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

const COGNITO_REGION = import.meta.env.VITE_COGNITO_REGION
const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID

let userManager: UserManager | null = null

if (COGNITO_REGION && COGNITO_USER_POOL_ID && COGNITO_CLIENT_ID) {
  userManager = new UserManager({
    authority: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`,
    client_id: COGNITO_CLIENT_ID,
    redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'email openid phone',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  })
}

export async function getAccessToken(): Promise<string | null> {
  if (!userManager) return null
  try {
    const user = await userManager.getUser()
    return user?.access_token ?? null
  } catch (error) {
    console.error('Failed to get Cognito token:', error)
    return null
  }
}
