
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home, Lock, UserX } from 'lucide-react';

export default function Forbidden() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="relative group">
          <div className="absolute -inset-6 rounded-full bg-destructive/20 blur-2xl group-hover:bg-destructive/30 transition-all duration-500" />
          <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-4 border-destructive/50 shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden">
            <Lock className="h-14 w-14 text-destructive animate-in zoom-in-50 duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-destructive/10">
              <ShieldAlert className="h-14 w-14 text-destructive" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 max-w-lg">
          <div className="space-y-1">
            <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl text-destructive/20">
              403
            </h1>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mt-[-1.5rem] bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              拒绝访问
            </h2>
          </div>
          
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground/80">
            <p className="text-lg font-medium">
              您没有权限访问此页面。
            </p>
            <p className="mt-2 text-sm opacity-80 leading-relaxed">
              您的当前角色权限不足以查看此资源。如果您认为这不正确，请联系您的管理员授予必要的访问权限。
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.back()}
            className="gap-2 border-primary/20 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回上一页
          </Button>
          <Button size="lg" asChild className="gap-2 shadow-lg shadow-primary/20">
            <Link href="/">
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-md">
          <div className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-help">
            <UserX className="h-6 w-6 mb-2 text-muted-foreground" />
            <h3 className="font-semibold text-sm">更换账号？</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">
              尝试使用管理员账号登录。
            </p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-help">
            <ShieldAlert className="h-6 w-6 mb-2 text-muted-foreground" />
            <h3 className="font-semibold text-sm">寻求帮助</h3>
            <p className="text-xs text-muted-foreground text-center mt-1">
              联系系统技术支持部门。
            </p>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/30 font-mono tracking-widest uppercase">
          Access Denied | Forbidden Resource
        </p>
      </div>
    </div>
  );
}
