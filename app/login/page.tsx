import { Shield, CheckCircle2 } from "lucide-react"
import { LoginForm } from "./LoginForm"
import { ThemeToggle } from "@/components/ThemeToggle"

const features = [
  "支持多 Cloudflare 账号统一管理",
  "ADMIN / VIEWER 双角色权限控制",
  "完整 DNS 类型 + 批量操作",
  "Token 加密存储，安全可靠",
]

export default function LoginPage() {
  const demoMode = process.env.DEMO_MODE === "true"
  const demoEmail = demoMode ? (process.env.SEED_ADMIN_EMAIL ?? "") : undefined
  const demoPassword = demoMode ? (process.env.SEED_ADMIN_PASSWORD ?? "") : undefined

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col w-[420px] shrink-0 bg-slate-900 dark:bg-slate-950 border-r border-white/5">
        <div className="flex-1 flex flex-col justify-center px-10 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 mb-6">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cloudflare DNS</h2>
          <p className="text-slate-400 mb-10 text-sm">安全 · 高效 · 开源的 DNS 管理系统</p>
          <div className="space-y-3.5">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-10 py-5 border-t border-white/10">
          <p className="text-xs text-slate-600">v1.0 · MIT License · Open Source</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="h-14 flex items-center justify-end px-6">
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold">欢迎回来</h1>
              <p className="text-sm text-muted-foreground">请登录您的账号</p>
            </div>
            <LoginForm demoEmail={demoEmail} demoPassword={demoPassword} />
            <p className="text-xs text-muted-foreground text-center">
              © 2026 Cloudflare DNS Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
