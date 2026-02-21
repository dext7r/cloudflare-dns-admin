
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff, AlertCircle, ArrowRight, Lightbulb } from "lucide-react"

const schema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(1, "请输入密码"),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

interface LoginFormProps {
  demoEmail?: string
  demoPassword?: string
}

export function LoginForm({ demoEmail, demoPassword }: LoginFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: demoEmail ?? "", password: demoPassword ?? "", remember: true },
  })

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("身份验证失败", {
          description: "邮箱或密码错误，请检查后再试。",
          action: {
            label: "重试",
            onClick: () => {},
          },
        })
      } else {
        toast.success("登录成功", {
          description: "正在为您跳转至控制中心...",
        })
        router.push("/")
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const rememberValue = watch("remember")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {demoEmail && (
        <div className="group relative flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-primary shadow-sm hover:bg-primary/10 transition-colors animate-in zoom-in-95 duration-500">
          <div className="mt-0.5 rounded-full bg-primary/20 p-1 group-hover:scale-110 transition-transform">
            <Lightbulb className="h-3 w-3" />
          </div>
          <div className="space-y-1">
            <p className="font-bold">演示模式开启</p>
            <p className="opacity-80">管理员账号已自动为您填充，点击下方按钮即可一键登录探索系统功能。</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
            邮箱地址
          </Label>
          <div className="relative group">
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              className="h-11 rounded-xl bg-muted/30 border-muted-foreground/10 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300 pl-4 group-hover:border-primary/30"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              安全密码
            </Label>
            <button
              type="button"
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              onClick={() => toast.info("请联系管理员重置密码")}
            >
              忘记密码？
            </button>
          </div>
          <div className="relative group">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="h-11 rounded-xl bg-muted/30 border-muted-foreground/10 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300 pl-4 pr-11 group-hover:border-primary/30"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/5"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 px-1">
        <Checkbox 
          id="remember" 
          checked={rememberValue}
          onCheckedChange={(checked) => setValue("remember", !!checked)}
          className="rounded-[4px] border-muted-foreground/30 data-[state=checked]:bg-primary"
        />
        <label
          htmlFor="remember"
          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground cursor-pointer select-none"
        >
          30 天内免登录
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:to-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all group" 
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            进入控制中心
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  )
}
