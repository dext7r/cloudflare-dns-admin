import Link from "next/link"
import { Globe, Shield, Zap, Lock, Server, RefreshCw, BarChart3, Webhook, ArrowRight } from "lucide-react"

const features = [
  { icon: Globe, title: "多账号多域名", desc: "同时管理多个 Cloudflare 账号下的所有域名，账号与域名一键切换无缝衔接" },
  { icon: Shield, title: "角色权限控制", desc: "ADMIN 全权管理，VIEWER 只读访问，精细化用户与 CF 账号绑定授权" },
  { icon: Zap, title: "高效批量操作", desc: "批量删除、BIND 格式导入导出，DNS 管理效率大幅提升" },
  { icon: Lock, title: "安全 Token 管理", desc: "API Token AES-256-GCM 加密存储，受保护域名防止误删误改" },
  { icon: Server, title: "Zone 全功能管理", desc: "Zone 概览、缓存清除、邮件路由、IP 防火墙、Workers 路由、批量重定向" },
  { icon: RefreshCw, title: "完整记录类型", desc: "支持 A / AAAA / CNAME / MX / TXT / SRV 等全部 14 种记录类型" },
  { icon: BarChart3, title: "流量分析", desc: "基于 Cloudflare Analytics API 的请求量、带宽、缓存命中率可视化" },
  { icon: Webhook, title: "审计日志与 Webhook", desc: "全量 DNS 操作审计记录，Webhook 实时推送变更至第三方系统" },
]

const quickLinks = [
  { href: "/docs/getting-started", label: "快速开始", desc: "从安装到首次登录，完成本地开发环境搭建" },
  { href: "/docs/deployment", label: "部署指南", desc: "Zeabur / Docker / Vercel 三种部署方案详解" },
  { href: "/docs/configuration", label: "环境配置", desc: "所有环境变量的用途与配置示例" },
  { href: "/docs/zone-overview", label: "Zone 管理功能", desc: "Zone 概览、缓存、邮件路由、防火墙等 CF API 功能说明" },
  { href: "/docs/audit-log", label: "审计与 Webhook", desc: "DNS 操作审计日志与 Webhook 推送配置" },
]

export default function DocsPage() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Cloudflare DNS 管理系统</h1>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
          基于 Next.js 15 构建的多用户 Cloudflare DNS 管理平台，支持多账号隔离、RBAC 权限控制和完整的 DNS
          记录管理。开源免费，可自托管。
        </p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">核心功能</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">快速导航</h2>
        <div className="space-y-2">
          {quickLinks.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 px-4 py-3 hover:border-primary/30 hover:bg-card transition-colors group"
            >
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {["Next.js 15", "NextAuth.js v5", "Prisma 5", "PostgreSQL", "Tailwind CSS v4", "shadcn/ui", "SWR", "Cloudflare API v4"].map(
            (tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </section>
    </article>
  )
}
