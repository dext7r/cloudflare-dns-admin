
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Hammer, Home, RefreshCw, Clock } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground transition-colors duration-500 overflow-hidden relative">
      {/* 施工背景效果 */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-24 bg-yellow-500/20 -rotate-6 translate-y-[-50%]" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-yellow-500/20 rotate-6 translate-y-[50%]" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div className="relative group">
          <div className="absolute -inset-8 rounded-full bg-yellow-500/10 blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700" />
          <div className="relative flex items-center justify-center h-40 w-40 rounded-3xl border-4 border-yellow-500/30 shadow-2xl bg-background/40 backdrop-blur-md rotate-3 transition-transform hover:rotate-0 duration-500 overflow-visible">
            <Hammer className="h-16 w-16 text-yellow-500 animate-bounce" />
            <div className="absolute -top-4 -right-4 h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 shadow-lg backdrop-blur-xl animate-pulse">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-8xl font-black tracking-tighter sm:text-9xl opacity-10 select-none">
              503
            </h1>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mt-[-2.5rem] bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              系统维护中
            </h2>
          </div>
          <p className="mx-auto max-w-[500px] text-muted-foreground text-lg leading-relaxed">
            我们正在对系统进行必要的升级和优化，以提供更好的服务。这通常不会花费太长时间。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.reload()}
            className="group gap-2 px-8 hover:bg-yellow-500/5 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            检查恢复状态
          </Button>
          <Button size="lg" asChild className="group gap-2 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <Link href="/">
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-dashed border-muted bg-muted/20 max-w-md w-full">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            维护状态记录
          </h3>
          <p className="text-xs text-muted-foreground">
            预计恢复时间：待定 (TBD)
            <br />
            主要任务：数据库迁移与性能调优
          </p>
        </div>

        <p className="mt-12 text-[10px] text-muted-foreground/30 font-mono tracking-[0.3em] uppercase animate-pulse">
          SERVICE UNAVAILABLE | SYSTEM UPGRADE IN PROGRESS
        </p>
      </div>
    </div>
  );
}
