
import { Shield, CheckCircle2, Github, Globe, Terminal, Lock } from "lucide-react"
import { LoginForm } from "./LoginForm"
import { ThemeToggle } from "@/components/ThemeToggle"
import Link from "next/link"

const features = [
  { title: "多账号集成", desc: "统一管理多个 Cloudflare 账号", icon: Globe },
  { title: "角色访问控制", desc: "精细化的 ADMIN / VIEWER 权限管理", icon: Shield },
  { title: "批量记录操作", desc: "支持导入导出、批量修改解析记录", icon: Terminal },
  { title: "安全加密存储", desc: "采用 AES-256-GCM 加密存储 Token", icon: Lock },
]

export default function LoginPage() {
  const demoMode = process.env.DEMO_MODE === "true"
  const demoEmail = demoMode ? (process.env.SEED_ADMIN_EMAIL ?? "") : undefined
  const demoPassword = demoMode ? (process.env.SEED_ADMIN_PASSWORD ?? "") : undefined

  return (
    <div className="min-h-screen flex bg-background overflow-hidden relative">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Left branding panel - Hidden on mobile */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 bg-slate-950 border-r border-white/5 relative z-10 overflow-hidden">
        {/* 背景纹理 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        
        <div className="flex-1 flex flex-col justify-center px-12 py-12 relative z-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-xl shadow-primary/20 mb-8 border border-white/10 group">
            <Shield className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          <div className="space-y-4 mb-12">
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Cloudflare DNS <br />
              <span className="text-primary-foreground/60">管理系统</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              专业、安全、高效的解析管理中枢
            </p>
          </div>

          <div className="grid gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <f.icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-12 py-8 border-t border-white/10 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            V0.2.0 · MIT License
          </div>
          <div className="flex gap-4">
            <Link href="https://github.com/dext7r/cloudflare-dns-admin" className="text-slate-500 hover:text-white transition-colors">
              <Github className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col relative z-10">
        <header className="h-16 flex items-center justify-between px-8">
          <div className="lg:hidden flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight">Cloudflare DNS</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3 text-center lg:text-left">
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                欢迎回来
              </h1>
              <p className="text-muted-foreground font-medium">
                输入您的账号凭据以进入管理控制中心
              </p>
            </div>

            <div className="p-1 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-muted shadow-2xl">
              <div className="bg-card p-8 rounded-[1.4rem] border border-border/50">
                <LoginForm demoEmail={demoEmail} demoPassword={demoPassword} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs text-muted-foreground/60 font-medium">
                © 2026 Cloudflare DNS Admin · 由开源社区驱动
              </p>
              
              <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                <Link href="/docs" className="hover:text-primary transition-colors underline-offset-4 hover:underline">使用文档</Link>
                <span>·</span>
                <Link href="/docs/getting-started" className="hover:text-primary transition-colors underline-offset-4 hover:underline">新手指南</Link>
                <span>·</span>
                <Link href="https://github.com/dext7r/cloudflare-dns-admin/issues" className="hover:text-primary transition-colors underline-offset-4 hover:underline">报告问题</Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
