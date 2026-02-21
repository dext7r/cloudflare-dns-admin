"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Shield,
  Globe,
  Users,
  KeyRound,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

interface AdminShellProps {
  children: React.ReactNode
  role: "ADMIN" | "VIEWER"
  user: { name?: string | null; email?: string | null }
}

export function AdminShell({ children, role, user }: AdminShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = role === "ADMIN"

  const navItems = [
    { href: "/", label: "DNS 管理", icon: Globe },
    ...(isAdmin
      ? [
          { href: "/admin/users", label: "用户管理", icon: Users },
          { href: "/admin/cf-accounts", label: "账号管理", icon: KeyRound },
        ]
      : []),
  ]

  const activeLabel = navItems.find((i) => i.href === pathname)?.label ?? "管理系统"

  function SidebarNav() {
    return (
      <div className="flex flex-col h-full bg-sidebar">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-14 border-b border-sidebar-border shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground leading-tight">
              Cloudflare DNS
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 leading-tight">管理系统</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-sidebar-border px-3 py-3 space-y-2">
          <div className="px-3 py-1">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.name || user.email}
            </p>
            {user.name && (
              <p className="text-[11px] text-sidebar-foreground/40 truncate mt-0.5">{user.email}</p>
            )}
            <Badge
              variant={isAdmin ? "default" : "secondary"}
              className="mt-1.5 text-[10px] h-4 px-1.5"
            >
              {role}
            </Badge>
          </div>
          <Separator className="opacity-20" />
          <div className="space-y-0.5">
            <ChangePasswordDialog />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 px-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => signOut({ callbackUrl: window.location.origin + "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[220px] shrink-0 border-r border-sidebar-border">
        <SidebarNav />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
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

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
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
            <span className="hidden sm:inline shrink-0">管理系统</span>
            <ChevronRight className="h-3 w-3 hidden sm:block shrink-0 opacity-40" />
            <span className="font-medium text-foreground truncate">{activeLabel}</span>
          </nav>
          <div className="ml-auto shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
