import Link from "next/link"
import {
  Shield,
  Globe,
  Zap,
  Lock,
  Server,
  RefreshCw,
  ChevronDown,
  ExternalLink,
  Code2,
  BarChart3,
  Webhook,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"

const features = [
  {
    icon: Globe,
    title: "多账号多域名",
    desc: "同时管理多个 Cloudflare 账号下的所有域名，账号与域名一键切换",
  },
  {
    icon: Shield,
    title: "角色权限控制",
    desc: "ADMIN 全权管理，VIEWER 只读访问，精细化用户与 CF 账号绑定授权",
  },
  {
    icon: Zap,
    title: "高效批量操作",
    desc: "批量删除、BIND 格式导入导出，DNS 管理效率大幅提升",
  },
  {
    icon: Lock,
    title: "安全 Token 管理",
    desc: "API Token AES-256-GCM 加密存储，受保护域名防止误删误改",
  },
  {
    icon: Server,
    title: "完整记录类型",
    desc: "支持 A/AAAA/CNAME/MX/TXT/SRV 等全部 14 种 DNS 记录类型",
  },
  {
    icon: RefreshCw,
    title: "Zone 全功能管理",
    desc: "Zone 概览、缓存清除、邮件路由、IP 防火墙、Workers 路由、批量重定向一站到位",
  },
  {
    icon: Webhook,
    title: "审计日志与 Webhook",
    desc: "全量 DNS 操作审计记录，Webhook 实时推送变更通知至第三方系统",
  },
  {
    icon: BarChart3,
    title: "流量分析",
    desc: "基于 Cloudflare Analytics API 的域名请求量、带宽、缓存命中率可视化看板",
  },
]

const techStack = [
  "Next.js 15",
  "NextAuth.js v5",
  "Prisma ORM",
  "PostgreSQL",
  "Cloudflare API v4",
  "Tailwind CSS v4",
  "shadcn/ui",
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="fixed top-0 right-0 z-50 p-3">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <Badge variant="secondary" className="mb-6 text-xs">
            开源 · 免费 · 自托管
          </Badge>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Cloudflare DNS
            <br />
            <span className="text-primary">管理系统</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            多账号、多域名 DNS 与 Zone 全功能一站式管理 · 开源免费
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" asChild>
              <Link href="/login">开始使用</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href="https://github.com/dext7r/cloudflare-dns-admin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="https://cloudflare-dns.us.ci"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700 hover:bg-green-100 transition-colors cursor-pointer dark:border-green-900 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              在线演示
              <span className="font-mono text-xs">cloudflare-dns.us.ci</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>
            <Link
              href="https://github.com/dext7r/cloudflare-dns-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span className="font-mono text-xs">dext7r/cloudflare-dns-admin</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>
          </div>
          <div className="mt-14 flex justify-center">
            <a
              href="#features"
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">为什么选择这个工具？</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border/60 bg-card/50 p-6 hover:border-primary/30 hover:bg-card transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="py-10 border-y border-border/40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">技术栈</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-muted/40 border border-border/40 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-2">立即开始</h2>
          <p className="text-muted-foreground mb-8">5 分钟完成部署，开始统一管理你的 Cloudflare DNS</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button size="lg" asChild>
              <Link href="/login">立即使用</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs/getting-started">查看文档</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        © 2026 Cloudflare DNS Admin · MIT License · Made with ♥
      </div>
    </div>
  )
}
