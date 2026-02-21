"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
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
import { Plus, Trash2, Loader2 } from "lucide-react"
import { useZoneContext } from "@/hooks/useZoneContext"
import { AccountSelector } from "@/components/AccountSelector"
import { ZoneSelector } from "@/components/ZoneSelector"
import type { EmailRoutingRule } from "@/lib/cloudflare"

interface Props {
  role: "ADMIN" | "VIEWER"
}

const schema = z.object({
  name: z.string().min(1, "请输入规则名称"),
  matcherEmail: z.string().email("请输入有效的源邮箱"),
  destEmail: z.string().email("请输入有效的目标邮箱"),
})

type FormValues = z.infer<typeof schema>

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function EmailRoutingManager({ role }: Props) {
  const { accountId, zoneId, accounts, zones, zonesLoading, onAccountChange, onZoneChange } =
    useZoneContext()
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const swrKey =
    zoneId ? `/api/cloudflare/email-routing?zoneId=${zoneId}&accountId=${accountId ?? ""}` : null

  const { data, isLoading, mutate } = useSWR<{ success: boolean; result: EmailRoutingRule[] }>(
    swrKey,
    fetcher
  )
  const rules = data?.result ?? []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function handleCreate(values: FormValues) {
    if (!zoneId) return
    setCreating(true)
    try {
      const res = await fetch(
        `/api/cloudflare/email-routing?zoneId=${zoneId}&accountId=${accountId ?? ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            enabled: true,
            priority: 0,
            matchers: [{ type: "literal", field: "to", value: values.matcherEmail }],
            actions: [{ type: "forward", value: [values.destEmail] }],
          }),
        }
      )
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("规则已创建")
      setCreateOpen(false)
      reset()
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建失败")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!zoneId) return
    try {
      const res = await fetch(
        `/api/cloudflare/email-routing/${id}?zoneId=${zoneId}&accountId=${accountId ?? ""}`,
        { method: "DELETE" }
      )
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("规则已删除")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <AccountSelector
          accounts={accounts}
          activeAccountId={accountId}
          onSelect={onAccountChange}
        />
        <ZoneSelector
          zones={zones}
          activeZoneId={zoneId}
          onSelect={onZoneChange}
          loading={zonesLoading}
        />
        {role === "ADMIN" && (
          <div className="ml-auto">
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  添加规则
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加邮件路由规则</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreate)} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="rule-name">规则名称</Label>
                    <Input id="rule-name" {...register("name")} />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="matcher-email">匹配邮箱</Label>
                    <Input id="matcher-email" type="email" {...register("matcherEmail")} />
                    {errors.matcherEmail && (
                      <p className="text-xs text-destructive">{errors.matcherEmail.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dest-email">转发至</Label>
                    <Input id="dest-email" type="email" {...register("destEmail")} />
                    {errors.destEmail && (
                      <p className="text-xs text-destructive">{errors.destEmail.message}</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setCreateOpen(false); reset() }}
                    >
                      取消
                    </Button>
                    <Button type="submit" disabled={creating}>
                      {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      创建
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
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
                <TableHead>匹配</TableHead>
                <TableHead>转发至</TableHead>
                <TableHead className="w-[90px]">状态</TableHead>
                {role === "ADMIN" && (
                  <TableHead className="w-[60px]">
                    <span className="sr-only">操作</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={role === "ADMIN" ? 5 : 4}
                    className="py-20 text-center text-sm text-muted-foreground"
                  >
                    未找到邮件路由规则
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => {
                  const matchers = rule.matchers as Array<{ value?: string }> | undefined
                  const actions = rule.actions as Array<{ value?: string[] }> | undefined
                  const matcherValue = matchers?.[0]?.value ?? "—"
                  const destValue = actions?.[0]?.value?.[0] ?? "—"
                  return (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium text-sm">{rule.name || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{matcherValue}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{destValue}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            rule.enabled
                              ? "border-emerald-500/30 text-emerald-400"
                              : "border-muted-foreground/30 text-muted-foreground"
                          }
                        >
                          {rule.enabled ? "启用" : "停用"}
                        </Badge>
                      </TableCell>
                      {role === "ADMIN" && (
                        <TableCell>
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
                                  删除规则 <strong>{rule.name || rule.id}</strong>？此操作不可撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(rule.id)}>
                                  删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
