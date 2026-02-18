import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { MessageSquare } from 'lucide-react'

export default function LoginScreen() {
  const { login } = useAuth()

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">AI Chat</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue</p>
        </div>
        <Button onClick={login} size="lg">
          Sign in
        </Button>
      </div>
    </div>
  )
}
