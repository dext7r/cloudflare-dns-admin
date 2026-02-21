
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { signOut } from 'next-auth/react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Monitor,
  Moon,
  Sun,
  Laptop,
  LogOut,
  KeyRound,
  Globe,
  LayoutDashboard,
  BarChart3,
  Settings2,
  Zap,
  Mail,
  ShieldAlert,
  Code2,
  ArrowRightLeft,
  ClipboardList,
  Webhook,
  Users,
  Search,
  Clock,
  Command as CommandIcon,
  HelpCircle,
  BookOpen,
  FileText,
  Package,
  History,
  ShieldCheck,
  HardDrive,
  Activity,
  Key,
  Database,
  ExternalLink,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [recent, setRecent] = React.useState<{id: string, label: string, href: string}[]>([]);
  const router = useRouter();
  const { setTheme } = useTheme();

  // 加载最近搜索
  React.useEffect(() => {
    const saved = localStorage.getItem('cmdk-recent');
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent items', e);
      }
    }
  }, []);

  const addToRecent = (item: {id: string, label: string, href: string}) => {
    const newRecent = [item, ...recent.filter(r => r.id !== item.id)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('cmdk-recent', JSON.stringify(newRecent));
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void, item?: {id: string, label: string, href: string}) => {
    setOpen(false);
    setSearch('');
    if (item) addToRecent(item);
    command();
  }, [recent]);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-background/50 border-border/50 hover:bg-accent transition-all duration-300 group overflow-hidden"
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Search className="h-4 w-4 xl:mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="hidden xl:inline-flex text-muted-foreground font-normal text-xs tracking-tight">搜索功能、记录、文档或命令...</span>
        <Kbd className="pointer-events-none absolute right-1.5 top-2 hidden xl:flex border-none bg-muted/50 h-6">
          <span className="text-[10px]">⌘</span>K
        </Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="您想寻找什么？输入关键词、功能、文档名..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[550px]">
          <CommandEmpty />
          
          {!search && recent.length > 0 && (
            <>
              <CommandGroup heading="最近访问">
                {recent.map((item) => (
                  <CommandItem 
                    key={item.id} 
                    onSelect={() => runCommand(() => router.push(item.href))}
                    value={`recent ${item.label}`}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="DNS 管理">
            <CommandItem onSelect={() => runCommand(() => router.push('/'), {id: 'dns-records', label: 'DNS 记录管理', href: '/'})} value="dns records records 管理 域名 解析">
              <Globe className="mr-2 h-4 w-4 text-blue-500" />
              <span>DNS 记录管理</span>
              <CommandShortcut>G D</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/zone-overview'), {id: 'zone-overview', label: '域名概览', href: '/zone-overview'})} value="zone overview dashboard 概览 控制面板">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>域名概览</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/analytics'))} value="analytics traffic data 流量 分析 数据统计">
              <BarChart3 className="mr-2 h-4 w-4 text-purple-500" />
              <span>流量与分析</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Zone 设置与安全">
            <CommandItem onSelect={() => runCommand(() => router.push('/firewall'))} value="firewall security ip block 防火墙 安全 IP 封禁">
              <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />
              <span>IP 防火墙</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/cache'))} value="cache purge speed optimization 缓存管理 清除缓存 性能优化">
              <Zap className="mr-2 h-4 w-4 text-yellow-500" />
              <span>缓存管理</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/email-routing'))} value="email routing mail forward 邮件路由 邮件转发">
              <Mail className="mr-2 h-4 w-4 text-sky-500" />
              <span>邮件路由</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/workers-routes'))} value="workers serverless code routes 路由 Serverless 代码脚本">
              <Code2 className="mr-2 h-4 w-4 text-orange-400" />
              <span>Workers 路由</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/redirects'))} value="redirects bulk domain rewrite 批量重定向 域名跳转">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              <span>批量重定向</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="系统管理">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/cf-accounts'), {id: 'accounts', label: 'Cloudflare 账号管理', href: '/admin/cf-accounts'})} value="admin accounts tokens cf cloudflare 账号管理 令牌 密钥">
              <KeyRound className="mr-2 h-4 w-4 text-orange-500" />
              <span>Cloudflare 账号管理</span>
              <CommandShortcut>G A</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/users'), {id: 'users', label: '用户管理', href: '/admin/users'})} value="admin users management rbac 用户管理 权限 角色">
              <Users className="mr-2 h-4 w-4 text-green-500" />
              <span>系统用户管理</span>
              <CommandShortcut>G U</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/audit-log'))} value="audit log history activity 审计日志 历史记录 活动详情">
              <History className="mr-2 h-4 w-4" />
              <span>审计日志</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/webhooks'))} value="webhooks callback notification 回调 通知 钩子">
              <Webhook className="mr-2 h-4 w-4" />
              <span>Webhook 设置</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="帮助与文档">
            <CommandItem onSelect={() => runCommand(() => router.push('/docs'), {id: 'docs', label: '帮助文档中心', href: '/docs'})} value="help docs support documentation 帮助文档 说明手册 支持">
              <BookOpen className="mr-2 h-4 w-4 text-blue-400" />
              <span>帮助文档中心</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/docs/getting-started'))} value="docs getting started beginner 快速开始 新手指南 入门教程">
              <FileText className="mr-2 h-4 w-4" />
              <span>快速开始指南</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/docs/dns'))} value="docs dns tutorial 记录管理 域名解析教程">
              <FileText className="mr-2 h-4 w-4" />
              <span>DNS 管理指南</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/docs/protected-zones'))} value="docs protected zones security 受保护域名 安全防护教程">
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>受保护域名指南</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="快捷操作">
            <CommandItem onSelect={() => runCommand(() => {
              const dialogBtn = document.querySelector('[data-password-dialog-trigger]') as HTMLButtonElement;
              if (dialogBtn) dialogBtn.click();
            })} value="change password security 修改密码 安全 账户安全">
              <Key className="mr-2 h-4 w-4 text-yellow-600" />
              <span>修改登录密码</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))} value="theme light mode switch 浅色模式 切换主题 皮肤">
              <Sun className="mr-2 h-4 w-4 text-yellow-500" />
              <span>切换至：浅色模式</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))} value="theme dark mode switch 深色模式 黑色 切换主题 皮肤">
              <Moon className="mr-2 h-4 w-4 text-indigo-400" />
              <span>切换至：深色模式</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))} value="theme system mode auto 自动主题 跟随系统">
              <Monitor className="mr-2 h-4 w-4" />
              <span>切换至：系统默认</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="账号">
            <CommandItem onSelect={() => runCommand(() => {
              const logoutBtn = document.querySelector('[data-logout-trigger]') as HTMLButtonElement;
              if (logoutBtn) logoutBtn.click();
              else signOut({ callbackUrl: window.location.origin + "/login" });
            })} value="logout signout exit 退出登录 登出">
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              <span>退出登录</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground select-none">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Kbd className="h-4 px-1 rounded-xs">Enter</Kbd> 选择</span>
            <span className="flex items-center gap-1"><Kbd className="h-4 px-1 rounded-xs">↑↓</Kbd> 移动</span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><Kbd className="h-4 px-1 rounded-xs">Esc</Kbd> 关闭</span>
            <span className="hidden sm:inline opacity-50">Cloudflare DNS Admin v0.2.0</span>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
