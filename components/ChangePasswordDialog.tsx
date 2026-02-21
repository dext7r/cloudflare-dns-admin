"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react"

const schema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(8, "新密码至少 8 位"),
    confirmPassword: z.string().min(1, "请确认新密码"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("密码已修改")
      setOpen(false)
      reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "修改失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                data-password-dialog-trigger
                className="w-full justify-start h-8 px-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                修改密码
              </Button>
            </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cp-current">当前密码</Label>
            <div className="relative">
              <Input id="cp-current" type={showPasswords ? "text" : "password"} autoComplete="current-password" className="pr-9" {...register("currentPassword")} />
              <button type="button" onClick={() => setShowPasswords((v) => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-new">新密码</Label>
            <div className="relative">
              <Input id="cp-new" type={showPasswords ? "text" : "password"} autoComplete="new-password" className="pr-9" {...register("newPassword")} />
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cp-confirm">确认新密码</Label>
            <div className="relative">
              <Input id="cp-confirm" type={showPasswords ? "text" : "password"} autoComplete="new-password" className="pr-9" {...register("confirmPassword")} />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setOpen(false); reset() }}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认修改
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
