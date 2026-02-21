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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { FirewallRule } from "@/lib/cloudflare"

interface Props {
  role: "ADMIN" | "VIEWER"
}

const schema = z.object({
  mode: z.enum(["block", "challenge", "whitelist", "js_challenge"]),
  target: z.enum(["ip", "ip_range", "asn", "country"]),
  value: z.string().min(1, "请输入值"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const MODE_LABELS: Record<string, string> = {
  block: "拦截",
  challenge: "验证",
  whitelist: "白名单",
  js_challenge: "JS 验证",
}

const TARGET_LABELS: Record<string, string> = {
  ip: "IP 地址",
  ip_range: "IP 范围",
  asn: "ASN",
  country: "国家",
}

function modeBadgeClass(mode: string) {
  if (mode === "block") return "border-red-500/30 text-red-400"
  if (mode === "whitelist") return "border-emerald-500/30 text-emerald-400"
  if (mode === "challenge" || mode === "js_challenge") return "border-amber-500/30 text-amber-400"
  return "border-muted-foreground/30 text-muted-foreground"
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function FirewallManager({ role }: Props) {
  const { accountId, zoneId, accounts, zones, zonesLoading, onAccountChange, onZoneChange } =
    useZoneContext()
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const swrKey =
    zoneId ? `/api/cloudflare/firewall?zoneId=${zoneId}&accountId=${accountId ?? ""}` : null

  const { data, isLoading, mutate } = useSWR<{ success: boolean; result: FirewallRule[] }>(
    swrKey,
    fetcher
  )
  const rules = data?.result ?? []

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { mode: "block", target: "ip" },
  })

  async function handleCreate(values: FormValues) {
    if (!zoneId) return
    setCreating(true)
    try {
      const res = await fetch(
        `/api/cloudflare/firewall?zoneId=${zoneId}&accountId=${accountId ?? ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: values.mode,
            configuration: { target: values.target, value: values.value },
            notes: values.notes || undefined,
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
        `/api/cloudflare/firewall/${id}?zoneId=${zoneId}&accountId=${accountId ?? ""}`,
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
                  <DialogTitle>添加防火墙规则</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreate)} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label>模式</Label>
                    <Controller
                      name="mode"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="block">拦截 (block)</SelectItem>
                            <SelectItem value="challenge">验证 (challenge)</SelectItem>
                            <SelectItem value="whitelist">白名单 (whitelist)</SelectItem>
                            <SelectItem value="js_challenge">JS 验证 (js_challenge)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>目标类型</Label>
                    <Controller
                      name="target"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ip">IP 地址</SelectItem>
                            <SelectItem value="ip_range">IP 范围 (CIDR)</SelectItem>
                            <SelectItem value="asn">ASN</SelectItem>
                            <SelectItem value="country">国家代码</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fw-value">值</Label>
                    <Input id="fw-value" {...register("value")} placeholder="IP / CIDR / ASN / 国家代码" />
                    {errors.value && (
                      <p className="text-xs text-destructive">{errors.value.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fw-notes">备注（可选）</Label>
                    <Input id="fw-notes" {...register("notes")} />
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
                <TableHead className="w-[120px]">模式</TableHead>
                <TableHead className="w-[120px]">目标类型</TableHead>
                <TableHead>值</TableHead>
                <TableHead>备注</TableHead>
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
                    未找到防火墙规则
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Badge variant="outline" className={modeBadgeClass(rule.mode)}>
                        {MODE_LABELS[rule.mode] ?? rule.mode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {TARGET_LABELS[rule.configuration.target] ?? rule.configuration.target}
                    </TableCell>
                    <TableCell className="text-sm font-mono">{rule.configuration.value}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {rule.notes || "—"}
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
                                删除针对 <strong>{rule.configuration.value}</strong> 的{" "}
                                {MODE_LABELS[rule.mode] ?? rule.mode} 规则？此操作不可撤销。
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
