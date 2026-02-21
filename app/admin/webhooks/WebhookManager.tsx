"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Pencil, Loader2, Eye, EyeOff } from "lucide-react"

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  secret?: string
  enabled: boolean
  createdAt: string
}

const AVAILABLE_EVENTS = [
  { value: "dns.create", label: "创建" },
  { value: "dns.update", label: "更新" },
  { value: "dns.delete", label: "删除" },
  { value: "dns.batch_delete", label: "批量删除" },
]

const webhookSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  url: z.string().url("请输入有效 URL"),
  events: z.array(z.string()).min(1, "至少选择一个事件"),
  secret: z.string().optional(),
  enabled: z.boolean(),
})

type WebhookValues = z.infer<typeof webhookSchema>

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

function WebhookForm({
  defaultValues,
  onSubmit,
  submitting,
  onCancel,
}: {
  defaultValues: WebhookValues
  onSubmit: (v: WebhookValues) => Promise<void>
  submitting: boolean
  onCancel: () => void
}) {
  const [showSecret, setShowSecret] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WebhookValues>({
    resolver: zodResolver(webhookSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label htmlFor="wh-name">名称</Label>
        <Input id="wh-name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wh-url">URL</Label>
        <Input id="wh-url" type="url" {...register("url")} />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>监听事件</Label>
        <Controller
          control={control}
          name="events"
          render={({ field }) => (
            <div className="space-y-1.5">
              {AVAILABLE_EVENTS.map((ev) => (
                <label
                  key={ev.value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    checked={field.value.includes(ev.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        field.onChange([...field.value, ev.value])
                      } else {
                        field.onChange(field.value.filter((v) => v !== ev.value))
                      }
                    }}
                  />
                  <span className="font-mono text-xs">{ev.value}</span>
                  <span className="text-muted-foreground">（{ev.label}）</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.events && <p className="text-xs text-destructive">{errors.events.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="wh-secret">Secret（可选）</Label>
        <div className="relative">
          <Input
            id="wh-secret"
            type={showSecret ? "text" : "password"}
            className="pr-9"
            {...register("secret")}
          />
          <button
            type="button"
            onClick={() => setShowSecret((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="enabled"
          render={({ field }) => (
            <Switch
              id="wh-enabled"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="wh-enabled">启用</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存
        </Button>
      </div>
    </form>
  )
}

const DEFAULT_VALUES: WebhookValues = {
  name: "",
  url: "",
  events: [],
  secret: "",
  enabled: true,
}

export function WebhookManager() {
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editTarget, setEditTarget] = useState<Webhook | null>(null)
  const [editing, setEditing] = useState(false)

  const { data, isLoading, mutate } = useSWR<{ success: boolean; result: Webhook[] }>(
    "/api/admin/webhooks",
    fetcher
  )
  const webhooks = data?.result ?? []

  async function handleCreate(values: WebhookValues) {
    setCreating(true)
    try {
      const res = await fetch("/api/admin/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("Webhook 已创建")
      setCreateOpen(false)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建失败")
    } finally {
      setCreating(false)
    }
  }

  async function handleEdit(values: WebhookValues) {
    if (!editTarget) return
    setEditing(true)
    try {
      const res = await fetch(`/api/admin/webhooks/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("Webhook 已更新")
      setEditTarget(null)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败")
    } finally {
      setEditing(false)
    }
  }

  async function handleToggle(id: string, enabled: boolean) {
    try {
      const res = await fetch(`/api/admin/webhooks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败")
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/webhooks/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("Webhook 已删除")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              添加 Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加 Webhook</DialogTitle>
            </DialogHeader>
            <WebhookForm
              defaultValues={DEFAULT_VALUES}
              onSubmit={handleCreate}
              submitting={creating}
              onCancel={() => setCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          加载中...
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>名称</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>事件</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[80px]">
                  <span className="sr-only">操作</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-muted-foreground text-sm">
                    暂无 Webhook 配置
                  </TableCell>
                </TableRow>
              ) : (
                webhooks.map((wh) => (
                  <TableRow key={wh.id}>
                    <TableCell className="font-medium text-sm">{wh.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono text-xs max-w-[260px] truncate">
                      {wh.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {wh.events.map((ev) => (
                          <Badge
                            key={ev}
                            variant="secondary"
                            className="text-xs py-0 font-mono"
                          >
                            {ev}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={wh.enabled}
                        onCheckedChange={(v) => handleToggle(wh.id, v)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog
                          open={editTarget?.id === wh.id}
                          onOpenChange={(v) => { if (!v) setEditTarget(null) }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setEditTarget(wh)}
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>编辑 Webhook</DialogTitle>
                            </DialogHeader>
                            {editTarget?.id === wh.id && (
                              <WebhookForm
                                defaultValues={{
                                  name: wh.name,
                                  url: wh.url,
                                  events: wh.events,
                                  secret: "",
                                  enabled: wh.enabled,
                                }}
                                onSubmit={handleEdit}
                                submitting={editing}
                                onCancel={() => setEditTarget(null)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                删除 Webhook <strong>{wh.name}</strong>？此操作不可撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(wh.id)}>
                                删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
