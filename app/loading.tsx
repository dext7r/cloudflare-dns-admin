
import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-colors duration-300">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
          <Spinner className="h-10 w-10 text-primary animate-pulse" />
        </div>
        
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold tracking-tight animate-pulse">
            加载中...
          </h3>
          <p className="text-sm text-muted-foreground max-w-[200px] mx-auto animate-in fade-in duration-1000">
            正在为您准备数据，请稍候。
          </p>
        </div>
        
        <div className="mt-4 flex gap-1">
          <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1 w-1 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
}
