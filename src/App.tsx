import Chat from './Chat.tsx'
import { AppSidebar } from './components/app-sidebar.tsx'
import LoginScreen from './components/LoginScreen.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { useAuth } from './lib/auth.tsx'
import { cn } from './lib/utils.ts'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'

const queryClient = new QueryClient()

const isAuthConfigured = Boolean(
  import.meta.env.VITE_COGNITO_REGION &&
  import.meta.env.VITE_COGNITO_USER_POOL_ID &&
  import.meta.env.VITE_COGNITO_CLIENT_ID,
)

export default function App() {
  const { isAuthenticated, isLoading, logout, user } = useAuth()

  if (isAuthConfigured && isLoading) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="pydantic-chat-ui-theme">
        <div className="flex h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ThemeProvider>
    )
  }

  if (isAuthConfigured && !isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="pydantic-chat-ui-theme">
        <LoginScreen />
      </ThemeProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pydantic-chat-ui-theme">
        <SidebarProvider defaultOpen>
          <AppSidebar />

          <div className="flex flex-col justify-center flex-1 h-screen overflow-hidden">
            <div
              className={cn(
                'flex flex-col max-w-4xl mx-auto relative w-full basis-[100vh] overflow-hidden',
                'has-[.stick-to-bottom:empty]:overflow-visible has-[.stick-to-bottom:empty]:basis-[0px] transition-[flex-basis] duration-200',
              )}
            >
              <Chat />
            </div>
          </div>
        </SidebarProvider>

        {isAuthConfigured && (
          <button
            onClick={logout}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={`Signed in as ${user?.email ?? user?.name ?? 'user'}`}
          >
            <span className="hidden sm:inline max-w-[150px] truncate">{user?.name ?? user?.email}</span>
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </ThemeProvider>
      <Toaster richColors />
    </QueryClientProvider>
  )
}
