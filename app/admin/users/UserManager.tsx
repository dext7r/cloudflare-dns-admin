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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus, Trash2, Loader2, Pencil, Eye, EyeOff } from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  role: "ADMIN" | "VIEWER"
  createdAt: string
  cfAccountIds: string[]
}

interface CfAccount {
  id: string
  name: string
}

const createUserSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少 8 位"),
  name: z.string().trim().optional(),
  role: z.enum(["ADMIN", "VIEWER"]),
})

type CreateUserValues = z.infer<typeof createUserSchema>

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

function BindingEditor({
  userId,
  cfAccountIds,
  allAccounts,
  onSaved,
}: {
  userId: string
  cfAccountIds: string[]
  allAccounts: CfAccount[]
  onSaved: () => void
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(cfAccountIds)
  const [saving, setSaving] = useState(false)

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/cf-accounts`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cfAccountIds: selected }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("绑定已更新")
      setOpen(false)
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败")
    } finally {
      setSaving(false)
    }
  }

  const boundNames = allAccounts.filter((a) => cfAccountIds.includes(a.id))

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        if (v) setSelected(cfAccountIds)
        setOpen(v)
      }}
    >
      <PopoverTrigger asChild>
        <button className="flex flex-wrap items-center gap-1 text-left cursor-pointer hover:opacity-70 transition-opacity min-h-7">
          {boundNames.length === 0 ? (
            <span className="text-xs text-muted-foreground">未绑定</span>
          ) : (
            boundNames.map((a) => (
              <Badge key={a.id} variant="secondary" className="text-xs py-0">
                {a.name}
              </Badge>
            ))
          )}
          <Pencil className="h-3 w-3 text-muted-foreground ml-0.5 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {allAccounts.length === 0 ? (
            <p className="text-xs text-muted-foreground px-1 py-2">暂无 CF 账号</p>
          ) : (
            allAccounts.map((account) => (
              <label
                key={account.id}
                className="flex items-center gap-2 px-1.5 py-1.5 rounded cursor-pointer hover:bg-muted text-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(account.id)}
                  onChange={() => toggle(account.id)}
                  className="rounded border-border"
                />
                {account.name}
              </label>
            ))
          )}
        </div>
        <div className="pt-2 mt-1 border-t">
          <Button size="sm" className="w-full h-7 text-xs" onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            保存
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function UserManager({ currentUserId }: { currentUserId: string }) {
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data, isLoading, mutate } = useSWR<{ success: boolean; result: User[] }>(
    "/api/admin/users",
    fetcher
  )
  const users = data?.result || []

  const { data: cfData } = useSWR<{ success: boolean; result: CfAccount[] }>(
    "/api/admin/cf-accounts",
    fetcher
  )
  const cfAccounts = cfData?.result || []

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "VIEWER" },
  })

  async function handleCreate(values: CreateUserValues) {
    setCreating(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("用户已创建")
      setCreateOpen(false)
      reset()
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建失败")
    } finally {
      setCreating(false)
    }
  }

  async function handleRoleChange(id: string, role: "ADMIN" | "VIEWER") {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("角色已更新")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "更新失败")
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("用户已删除")
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败")
    }
  }

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      {/* Page toolbar */}
      <div className="flex items-center justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              新建用户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新建用户</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleCreate)} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="create-email">邮箱</Label>
                <Input id="create-email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-password">密码</Label>
                <div className="relative">
                  <Input
                    id="create-password"
                    type={showPassword ? "text" : "password"}
                    className="pr-9"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-name">姓名（可选）</Label>
                <Input id="create-name" {...register("name")} />
              </div>
              <div className="space-y-1.5">
                <Label>角色</Label>
                <Select
                  defaultValue="VIEWER"
                  onValueChange={(v) => setValue("role", v as "ADMIN" | "VIEWER")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEWER">VIEWER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
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
                <TableHead>邮箱</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead className="w-[130px]">角色</TableHead>
                <TableHead>绑定账号</TableHead>
                <TableHead className="w-[140px]">创建时间</TableHead>
                <TableHead className="w-[60px]">
                  <span className="sr-only">操作</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-sm">{user.email}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.name || "—"}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(v) => handleRoleChange(user.id, v as "ADMIN" | "VIEWER")}
                      disabled={user.id === currentUserId}
                    >
                      <SelectTrigger className="h-7 w-[110px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEWER">VIEWER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? (
                      <Badge variant="secondary" className="text-xs">全部</Badge>
                    ) : (
                      <BindingEditor
                        userId={user.id}
                        cfAccountIds={user.cfAccountIds}
                        allAccounts={cfAccounts}
                        onSaved={mutate}
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={user.id === currentUserId}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            删除用户 <strong>{user.email}</strong>？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)}>
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
