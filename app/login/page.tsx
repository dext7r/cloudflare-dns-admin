import { Shield } from "lucide-react"
import { LoginForm } from "./LoginForm"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">登录</h1>
          <p className="text-sm text-muted-foreground">Cloudflare DNS 管理系统</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
