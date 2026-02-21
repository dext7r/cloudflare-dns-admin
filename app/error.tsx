
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, Home, ChevronRight, ChevronDown, Copy, Check, Terminal, Bug } from 'lucide-react';
import { toast } from 'sonner';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 自动记录错误日志
    console.error('Captured application error:', error);
  }, [error]);

  const copyError = () => {
    const errorText = `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nStack: ${error.stack || 'N/A'}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    toast.success('详细错误信息已复制到剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8 transition-colors duration-500 overflow-hidden relative">
      {/* 故障背景效果 */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-destructive blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-destructive blur-[100px] animate-pulse [animation-delay:1.5s]" />
      </div>

      <Card className="w-full max-w-2xl overflow-hidden border-destructive/20 shadow-2xl dark:border-destructive/10 dark:shadow-3xl z-10 transition-all duration-300 hover:shadow-destructive/5">
        <div className="h-1 w-full bg-gradient-to-r from-destructive via-destructive/50 to-destructive animate-shimmer" />
        
        <CardHeader className="text-center pt-10">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-destructive/10 border-2 border-destructive/10 rotate-3 transition-transform hover:rotate-0 duration-500">
            <Bug className="h-12 w-12 text-destructive animate-pulse" />
          </div>
          <CardTitle className="mt-8 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            系统发生故障
          </CardTitle>
          <CardDescription className="mt-4 text-xl text-muted-foreground/80 font-medium">
            抱歉，我们遇到了一些无法自动处理的内部错误。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 py-4">
          <div className="p-4 rounded-xl border-l-4 border-destructive bg-destructive/5 text-destructive font-medium flex gap-3 items-center animate-in slide-in-from-left duration-500">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="text-sm">错误摘要: {error.message || '系统运行时异常'}</p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-1 transition-all duration-300">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:bg-muted p-4 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-primary" />
                <span>技术诊断详情 (仅限开发/运维)</span>
              </div>
              {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {showDetails && (
              <div className="p-4 pt-0 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative">
                  <pre className="p-4 bg-black/90 dark:bg-black/50 rounded-xl text-[10px] sm:text-xs font-mono text-green-500/90 break-all overflow-auto max-h-[250px] border border-white/5 shadow-inner leading-relaxed">
                    <code>
                      {`# ERROR_REPORT_${new Date().getTime()}\n`}
                      {`Timestamp: ${new Date().toISOString()}\n`}
                      {`Message:   ${error.message}\n`}
                      {`Digest:    ${error.digest || 'N/A'}\n`}
                      {`URL:       ${typeof window !== 'undefined' ? window.location.href : 'SSR'}\n`}
                      {`----------------------------------------\n`}
                      {error.stack || 'Stack trace not available in current context.'}
                    </code>
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2 h-8 gap-2 bg-white/10 backdrop-blur hover:bg-white/20 border-white/10"
                    onClick={copyError}
                  >
                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    {copied ? '已复制' : '复制报告'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 bg-muted/20 p-8 border-t border-muted/50">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2 border-primary/20 hover:bg-primary/5 transition-all duration-300"
          >
            <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            尝试重试
          </Button>
          <Button 
            size="lg" 
            asChild 
            className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              返回控制中心
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-[10px] text-muted-foreground/30 font-mono tracking-widest uppercase">
        HTTP 500 | INTERNAL SERVER EXCEPTION | RUNTIME ERROR
      </p>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
