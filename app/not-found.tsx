
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft, Home, Search, LayoutDashboard, Settings, User } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const helpfulLinks = [
    { label: '控制面板', href: '/', icon: LayoutDashboard },
    { label: '个人中心', href: '/profile', icon: User },
    { label: '系统设置', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-500 overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-secondary/30 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="relative group scale-110">
          <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/15 transition-all duration-700" />
          <div className="relative flex items-center justify-center h-40 w-40 rounded-full border-2 border-dashed border-primary/30 shadow-2xl bg-background/40 backdrop-blur-md overflow-visible">
            <FileQuestion className="h-16 w-16 text-primary animate-bounce-slow" />
            <div className="absolute -top-4 -right-4 h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/30 shadow-lg backdrop-blur-xl animate-spin-slow">
              <Search className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-8xl font-black tracking-tighter sm:text-9xl opacity-10 select-none">
              404
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mt-[-2.5rem] bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              迷失在数字荒野
            </h2>
          </div>
          <p className="mx-auto max-w-[500px] text-muted-foreground text-lg leading-relaxed">
            哎呀！看来这个页面在我们的服务器集群中走丢了。它可能已被删除、更名，或暂时不可用。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.back()}
            className="group gap-2 px-8 hover:bg-primary/5 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            返回上一页
          </Button>
          <Button size="lg" asChild className="group gap-2 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <Link href="/">
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              返回首页
            </Link>
          </Button>
        </div>

        <div className="w-full max-w-lg mt-12 pt-8 border-t border-dashed border-muted">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            试试这些常用路径
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
            {helpfulLinks.map((link) => (
              <Button key={link.label} variant="ghost" asChild className="h-auto flex flex-col gap-2 p-4 border border-transparent hover:border-primary/10 hover:bg-primary/5 rounded-2xl transition-all group">
                <Link href={link.href}>
                  <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-primary/20 transition-colors">
                    <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs font-medium">{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <p className="mt-12 text-[10px] text-muted-foreground/30 font-mono tracking-[0.3em] uppercase animate-pulse">
          LOST IN TRANSMISSION | DATA NOT FOUND
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
