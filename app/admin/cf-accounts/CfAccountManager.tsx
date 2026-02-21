"use client"

import { useState, useEffect } from "react"
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
import { Plus, Trash2, Pencil, Loader2, Zap, Eye, EyeOff, Info, ExternalLink } from "lucide-react"

interface CfAccount {
  id: string
  name: string
  createdAt: string
  lastTestAt: string | null
  lastTestStatus: string | null
}

const createSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  token: z.string().min(1, "Token 不能为空"),
})

const editSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  token: z.string().optional(),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function CfAccountManager() {
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editTarget, setEditTarget] = useState<CfAccount | null>(null)
  const [editing, setEditing] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [tokenStatus, setTokenStatus] = useState<Record<string, "ok" | "error">>({})
  const [showCreateToken, setShowCreateToken] = useState(false)
  const [showEditToken, setShowEditToken] = useState(false)

  const { data, isLoading, mutate } = useSWR<{ success: boolean; result: CfAccount[] }>(
    "/api/admin/cf-accounts",
    fetcher
  )
  const accounts = data?.result || []

  useEffect(() => {
    if (accounts.length === 0) return
    setTokenStatus((prev) => {
      const next = { ...prev }
      for (const a of accounts) {
        if (!(a.id in next) && a.lastTestStatus) {
          next[a.id] = a.lastTestStatus as "ok" | "error"
        }
      }
      return next
    })
  }, [accounts])

  const createForm = useForm<CreateValues>({ resolver: zodResolver(createSchema) })
  const editForm = useForm<EditValues>({ resolver: zodResolver(editSchema) })

  async function handleCreate(values: CreateValues) {
    setCreating(true)
    try {
      const res = await fetch("/api/admin/cf-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("账号已添加")
      setCreateOpen(false)
      createForm.reset()
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "添加失败")
    } finally {
      setCreating(false)
    }
  }

  async function handleEdit(values: EditValues) {
    if (!editTarget) return
    setEditing(true)
    try {
      const res = await fetch(`/api/admin/cf-accounts/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("账号已更新")
      setEditTarget(null)
      editForm.reset()
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败")
    } finally {
      setEditing(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/cf-accounts/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("账号已删除")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败")
    }
  }

  async function handleTest(id: string) {
    setTestingId(id)
    try {
      const res = await fetch(`/api/admin/cf-accounts/${id}/test`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setTokenStatus((prev) => ({ ...prev, [id]: "ok" }))
      toast.success("Token 可用")
    } catch (err) {
      setTokenStatus((prev) => ({ ...prev, [id]: "error" }))
      toast.error(err instanceof Error ? err.message : "Token 不可用")
    } finally {
      setTestingId(null)
    }
  }

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      {/* Permission guide */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm dark:border-blue-900 dark:bg-blue-950/30">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-medium text-blue-900 dark:text-blue-100">Token 所需最低权限</p>
          <p className="text-blue-700 dark:text-blue-300">
            创建自定义 Token 时，请至少包含以下两项权限：
            <code className="mx-1 rounded bg-blue-100 px-1 py-0.5 font-mono text-xs dark:bg-blue-900">区域 → DNS → 编辑</code>
            和
            <code className="mx-1 rounded bg-blue-100 px-1 py-0.5 font-mono text-xs dark:bg-blue-900">区域 → 区域 → 读取</code>
          </p>
          <a
            href="https://dash.cloudflare.com/profile/api-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
          >
            前往 Cloudflare 创建 Token
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      {/* Page toolbar */}
      <div className="flex items-center justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              添加账号
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加 Cloudflare 账号</DialogTitle>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="cf-name">账号名称</Label>
                <Input id="cf-name" placeholder="例：主账号" {...createForm.register("name")} />
                {createForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cf-token">API Token</Label>
                <div className="relative">
                  <Input
                    id="cf-token"
                    type={showCreateToken ? "text" : "password"}
                    placeholder="Cloudflare API Token"
                    className="pr-9"
                    {...createForm.register("token")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreateToken((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showCreateToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {createForm.formState.errors.token && (
                  <p className="text-xs text-destructive">
                    {createForm.formState.errors.token.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setCreateOpen(false); createForm.reset() }}
                >
                  取消
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  添加
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
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
                <TableHead>账号名称</TableHead>
                <TableHead className="w-[160px]">添加时间</TableHead>
                <TableHead className="w-[80px]">
                  <span className="sr-only">操作</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-muted-foreground py-12"
                  >
                    暂无账号，点击「添加账号」开始配置
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center gap-2">
                        {tokenStatus[account.id] === "ok" && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                        {tokenStatus[account.id] === "error" && (
                          <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                        )}
                        {account.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(account.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleTest(account.id)}
                          disabled={testingId === account.id}
                          title="测试可用性"
                        >
                          {testingId === account.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                          ) : (
                            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </Button>
                        <Dialog
                          open={editTarget?.id === account.id}
                          onOpenChange={(open) => {
                            if (!open) { setEditTarget(null); editForm.reset() }
                            else { setEditTarget(account); editForm.setValue("name", account.name) }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>编辑账号</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={editForm.handleSubmit(handleEdit)}
                              className="space-y-4 pt-2"
                            >
                              <div className="space-y-1.5">
                                <Label htmlFor="edit-name">账号名称</Label>
                                <Input id="edit-name" {...editForm.register("name")} />
                                {editForm.formState.errors.name && (
                                  <p className="text-xs text-destructive">
                                    {editForm.formState.errors.name.message}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="edit-token">API Token</Label>
                                <div className="relative">
                                  <Input
                                    id="edit-token"
                                    type={showEditToken ? "text" : "password"}
                                    placeholder="留空则保留原 Token"
                                    className="pr-9"
                                    {...editForm.register("token")}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowEditToken((v) => !v)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                  >
                                    {showEditToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => { setEditTarget(null); editForm.reset() }}
                                >
                                  取消
                                </Button>
                                <Button type="submit" disabled={editing}>
                                  {editing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  保存
                                </Button>
                              </div>
                            </form>
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
                                删除账号 <strong>{account.name}</strong>？此操作不可撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(account.id)}>
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
