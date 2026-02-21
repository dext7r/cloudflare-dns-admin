"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Shield,
  BookOpen,
  Rocket,
  Settings2,
  Server,
  Users,
  KeyRound,
  Globe,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  BarChart3,
  Zap,
  Mail,
  ShieldAlert,
  Code2,
  ArrowRightLeft,
  ClipboardList,
  Webhook,
} from "lucide-react"

const navSections = [
  {
    label: "入门",
    items: [
      { href: "/docs", label: "介绍", icon: BookOpen, exact: true },
      { href: "/docs/getting-started", label: "快速开始", icon: Rocket },
      { href: "/docs/configuration", label: "环境配置", icon: Settings2 },
      { href: "/docs/deployment", label: "部署指南", icon: Server },
    ],
  },
  {
    label: "功能",
    items: [
      { href: "/docs/users", label: "用户与权限", icon: Users },
      { href: "/docs/cf-accounts", label: "CF 账号管理", icon: KeyRound },
      { href: "/docs/dns", label: "DNS 管理", icon: Globe },
      { href: "/docs/protected-zones", label: "受保护域名", icon: ShieldCheck },
      { href: "/docs/zone-overview", label: "Zone 概览", icon: LayoutDashboard },
      { href: "/docs/analytics", label: "流量分析", icon: BarChart3 },
      { href: "/docs/zone-settings", label: "Zone 设置", icon: Settings2 },
      { href: "/docs/cache", label: "缓存管理", icon: Zap },
      { href: "/docs/email-routing", label: "邮件路由", icon: Mail },
      { href: "/docs/firewall", label: "IP 防火墙", icon: ShieldAlert },
      { href: "/docs/workers-routes", label: "Workers 路由", icon: Code2 },
      { href: "/docs/redirects", label: "批量重定向", icon: ArrowRightLeft },
      { href: "/docs/audit-log", label: "审计日志", icon: ClipboardList },
      { href: "/docs/webhooks", label: "Webhook", icon: Webhook },
    ],
  },
]

const allNavItems = navSections.flatMap((s) => s.items)

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeLabel =
    allNavItems.find((i) =>
      i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(i.href + "/")
    )?.label ?? "文档"

  function SidebarNav() {
    return (
      <div className="flex flex-col h-full bg-sidebar">
        <div className="flex items-center gap-3 px-5 h-14 border-b border-sidebar-border shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground leading-tight">
              Cloudflare DNS
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 leading-tight">文档</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <h3 className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/30">
                {section.label}
              </h3>
              <div className="space-y-0.5">
                {section.items.map(({ href, label, icon: Icon, exact }) => {
                  const isActive = exact
                    ? pathname === href
                    : pathname === href || pathname.startsWith(href + "/")
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <Separator className="opacity-20 mb-2" />
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            返回主页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden lg:block w-[220px] shrink-0 border-r border-sidebar-border">
        <SidebarNav />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[220px] border-r border-sidebar-border lg:hidden",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-7 w-7 z-10 text-sidebar-foreground/60"
          onClick={() => setMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <SidebarNav />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden shrink-0"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
            <span className="hidden sm:inline shrink-0">文档</span>
            <ChevronRight className="h-3 w-3 hidden sm:block shrink-0 opacity-40" />
            <span className="font-medium text-foreground truncate">{activeLabel}</span>
          </nav>
          <div className="ml-auto shrink-0">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
