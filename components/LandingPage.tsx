
'use client';

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
  ArrowRight,
  Github,
  CheckCircle2,
  Sparkles,
  Database,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"

const features = [
  {
    icon: Globe,
    title: "多账号管理",
    desc: "一键管理多个 Cloudflare 账号，打破单一账户限制，实现跨账户域名统筹。",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "精细化权限 (RBAC)",
    desc: "内置 ADMIN 与 VIEWER 角色，支持将特定的 CF 账号授权给指定用户，安全可控。",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "极致批量操作",
    desc: "支持批量删除、修改及标准 BIND 格式导入导出，让繁琐的解析工作瞬间完成。",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Lock,
    title: "安全至上",
    desc: "令牌采用 AES-256-GCM 高强度加密存储。支持‘受保护域名’配置，防止误删误改。",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: BarChart3,
    title: "全方位分析看板",
    desc: "深度集成 Cloudflare Analytics，直观展示请求量、带宽及缓存命中率等核心指标。",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Webhook,
    title: "审计与联动",
    desc: "详尽的操作日志记录，支持 Webhook 实时推送变更，轻松对接飞书、钉钉等三方平台。",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
]

const stats = [
  { label: "DNS 类型支持", value: "14+" },
  { label: "加密算法", value: "AES-256" },
  { label: "平均管理效率提升", value: "300%" },
  { label: "开源协议", value: "MIT" },
]

const NAV_ITEMS = [
  { label: "DNS 管理", active: true },
  { label: "Zone 概览" },
  { label: "缓存管理" },
  { label: "流量分析" },
  { label: "邮件路由" },
  { label: "IP 防火墙" },
  { label: "Workers 路由" },
]

const DNS_ROWS = [
  { name: "@", type: "A", color: "text-blue-500 bg-blue-500/10", content: "104.21.0.1", ttl: "Auto", proxy: true },
  { name: "www", type: "CNAME", color: "text-violet-500 bg-violet-500/10", content: "cloudflare-dns.us.ci", ttl: "Auto", proxy: true },
  { name: "mail", type: "MX", color: "text-amber-500 bg-amber-500/10", content: "smtp.cloudflare-dns.us.ci", ttl: "3600", proxy: false },
  { name: "_dmarc", type: "TXT", color: "text-green-500 bg-green-500/10", content: 'v=DMARC1; p=none', ttl: "Auto", proxy: false },
  { name: "api", type: "A", color: "text-blue-500 bg-blue-500/10", content: "198.41.0.4", ttl: "Auto", proxy: true },
  { name: "cdn", type: "CNAME", color: "text-violet-500 bg-violet-500/10", content: "assets.cdn.net", ttl: "300", proxy: true },
]

function DashboardPreview() {
  return (
    <div className="w-full h-full bg-background flex text-[10px] pointer-events-none select-none overflow-hidden">
      {/* 侧边栏 */}
      <div className="w-[130px] shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="h-9 border-b border-sidebar-border flex items-center px-3 gap-1.5">
          <div className="h-4 w-4 rounded bg-primary flex items-center justify-center shrink-0">
            <Shield className="h-2.5 w-2.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-[9px] text-sidebar-foreground truncate">CF DNS Admin</span>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`px-2 py-[5px] rounded-md text-[9px] font-medium truncate ${item.active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/50"
                }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-sidebar-border/50">
          <div className="px-2 py-[5px] rounded text-[8px] text-sidebar-foreground/30 truncate">
            admin@example.com
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶栏 */}
        <div className="h-9 border-b flex items-center px-4 gap-2 shrink-0 bg-card/50">
          <span className="font-semibold text-[10px]">DNS 管理</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="border rounded px-2 py-0.5 text-[9px] text-muted-foreground flex items-center gap-1 bg-muted/30">
              cloudflare-dns.us.ci
              <ChevronDown className="h-2 w-2" />
            </div>
            <div className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-[9px] font-medium">
              + 添加记录
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-3 flex flex-col gap-2">
          {/* 筛选栏 */}
          <div className="flex gap-1.5">
            <div className="flex-1 border rounded px-2 py-1 text-[9px] text-muted-foreground bg-muted/20">
              搜索主机记录...
            </div>
            <div className="border rounded px-2 py-1 text-[9px] text-muted-foreground bg-muted/20">全部类型</div>
            <div className="border rounded px-2 py-1 text-[9px] text-muted-foreground bg-muted/20">导出</div>
          </div>

          {/* 表格 */}
          <div className="flex-1 rounded-lg border border-border/50 overflow-hidden">
            <div className="grid grid-cols-[1.2fr_52px_2fr_44px_32px_20px] gap-x-2 px-3 py-1.5 bg-muted/30 border-b border-border/40 text-[8px] text-muted-foreground font-medium">
              <span>名称</span>
              <span>类型</span>
              <span>内容</span>
              <span>TTL</span>
              <span>代理</span>
              <span />
            </div>
            {DNS_ROWS.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.2fr_52px_2fr_44px_32px_20px] gap-x-2 px-3 py-[5px] text-[9px] border-b border-border/30 last:border-0 items-center ${i % 2 === 1 ? "bg-muted/10" : ""
                  }`}
              >
                <span className="font-mono truncate text-foreground/80">{row.name}</span>
                <span>
                  <span className={`inline-block px-1 py-0.5 rounded text-[7px] font-bold ${row.color}`}>
                    {row.type}
                  </span>
                </span>
                <span className="font-mono truncate text-muted-foreground">{row.content}</span>
                <span className="text-muted-foreground">{row.ttl}</span>
                <span>
                  {row.proxy ? (
                    <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
                  ) : (
                    <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/20" />
                  )}
                </span>
                <span className="text-muted-foreground/30 text-[8px]">···</span>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between text-[8px] text-muted-foreground px-1">
            <span>共 24 条记录</span>
            <div className="flex gap-1">
              {["‹", "1", "2", "3", "›"].map((p, _i) => (
                <span
                  key={_i}
                  className={`border rounded px-1.5 py-0.5 ${p === "1" ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/20"
                    }`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* 顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">CF DNS Admin</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">功能特性</a>
            <a href="#tech" className="hover:text-primary transition-colors">技术架构</a>
            <Link href="/docs" className="hover:text-primary transition-colors">文档指南</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/login">登录</Link>
            </Button>
            <Button size="sm" asChild className="shadow-lg shadow-primary/20">
              <Link href="/login">立即开始</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero 区域 */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 dark:opacity-10" />
        </div>

        <div className="container mx-auto px-4 text-center space-y-8 relative">
          <Badge variant="outline" className="py-1 px-4 border-primary/20 bg-primary/5 text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="h-3 w-3 mr-2" />
            全新 v0.2.0 版本现已发布
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
            重塑您的 <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Cloudflare DNS
            </span> 管理体验
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            专为多账号设计的企业级 DNS 管理中枢。安全、高效、完全开源，让数以千计的域名解析在指尖起舞。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <Button size="lg" asChild className="h-12 px-8 rounded-full shadow-xl shadow-primary/20 group">
              <Link href="/login">
                免费部署
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full bg-background/50 backdrop-blur">
              <Link href="https://github.com/dext7r/cloudflare-dns-admin" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                GitHub 源码
              </Link>
            </Button>
          </div>

          {/* 预览卡片 */}
          <div className="mt-16 relative mx-auto max-w-5xl group animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div className="relative rounded-[2rem] border border-border/50 bg-card overflow-hidden shadow-2xl">
              <div className="h-10 border-b bg-muted/30 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/20" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                  <div className="h-3 w-3 rounded-full bg-green-500/20" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/50 px-3 py-1 rounded-md border text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono">
                    <Lock className="h-2.5 w-2.5" />cloudflare-dns.us.ci
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-gradient-to-b from-transparent to-muted/10">
                <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border/30 shadow-inner">
                  <DashboardPreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 数据概览 */}
      <section className="py-12 border-y bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center space-y-1">
                <p className="text-3xl md:text-4xl font-black text-primary">{s.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">为您而生的全能管理系统</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              告别繁琐的 Cloudflare 原生后台，享受由专业管理工具带来的丝滑与高效。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-[2rem] border border-border/50 bg-card hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`h-14 w-14 rounded-2xl ${f.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`h-7 w-7 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术架构 */}
      <section id="tech" className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <Badge className="bg-blue-500 hover:bg-blue-600">现代化技术栈</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">基于顶级开源技术构建</h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                我们采用业界领先的 Next.js 15 框架与 Prisma ORM，确保系统拥有极致的性能与卓越的可维护性。全量 API 兼容，数据由您完全掌控。
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Next.js 15", icon: Globe },
                  { name: "Tailwind 4.0", icon: Zap },
                  { name: "Prisma ORM", icon: Database },
                  { name: "TypeScript 5", icon: Code2 },
                ].map((t) => (
                  <div key={t.name} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                    <t.icon className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg">
              <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full" />
              <div className="relative rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-3xl overflow-hidden group">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">全栈架构设计</h4>
                    <p className="text-slate-500 text-sm">自托管，数据主权不妥协</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {[
                    "NextAuth.js v5 身份认证安全防线",
                    "基于 Redis 的 API 速率限制 (可选)",
                    "后端加密引擎：AES-256-GCM",
                    "响应式布局支持移动端全能操作"
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-slate-300 font-medium">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 p-12 md:p-20 text-center overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 h-full w-full opacity-10 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="90" cy="10" r="30" fill="white" />
                <circle cx="10" cy="90" r="40" fill="white" />
              </svg>
            </div>

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto text-primary-foreground">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                准备好提升您的管理效率了吗？
              </h2>
              <p className="text-primary-foreground/80 text-lg md:text-xl font-medium">
                立刻在您的服务器上部署 CF DNS Admin，体验前所未有的 DNS 管理快感。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" variant="secondary" asChild className="h-14 px-10 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                  <Link href="/login">现在开始使用</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-10 rounded-full font-bold text-lg bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all">
                  <Link href="/docs/getting-started">阅读部署手册</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="py-12 border-t border-border/40 relative bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight">CF DNS Admin</span>
            </div>

            <div className="flex gap-8 text-sm font-semibold text-muted-foreground">
              <Link href="https://github.com/dext7r" className="hover:text-primary transition-colors">作者 GitHub</Link>
              <Link href="/docs" className="hover:text-primary transition-colors">文档</Link>
              <Link href="https://github.com/dext7r/cloudflare-dns-admin/blob/main/LICENSE" className="hover:text-primary transition-colors">MIT 开源授权</Link>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              © 2026 Cloudflare DNS Admin · 由开源力量驱动
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
