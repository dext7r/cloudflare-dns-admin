"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AccountSelector } from "@/components/AccountSelector"
import { ZoneSelector } from "@/components/ZoneSelector"
import { useZoneContext } from "@/hooks/useZoneContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader2, Trash2 } from "lucide-react"

interface Props {
  role: "ADMIN" | "VIEWER"
}

export function CacheManagerClient({ role }: Props) {
  const { accountId, zoneId, accounts, zones, zonesLoading, onAccountChange, onZoneChange } =
    useZoneContext()
  const [purgingAll, setPurgingAll] = useState(false)
  const [purgingUrls, setPurgingUrls] = useState(false)
  const [urlInput, setUrlInput] = useState("")

  const disabled = role !== "ADMIN"

  async function purge(body: object) {
    if (!zoneId) return
    const res = await fetch(
      `/api/cloudflare/cache?zoneId=${zoneId}&accountId=${accountId ?? ""}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    )
    const json = await res.json()
    if (!json.success) throw new Error(json.error || "清除失败")
  }

  async function handlePurgeAll() {
    setPurgingAll(true)
    try {
      await purge({})
      toast.success("全站缓存已清除")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "清除失败")
    } finally {
      setPurgingAll(false)
    }
  }

  async function handlePurgeUrls() {
    const urls = urlInput
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean)
    if (urls.length === 0) {
      toast.error("请输入至少一个 URL")
      return
    }
    setPurgingUrls(true)
    try {
      await purge({ urls })
      toast.success(`已清除 ${urls.length} 条缓存`)
      setUrlInput("")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "清除失败")
    } finally {
      setPurgingUrls(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          {accounts.length > 0 && (
            <AccountSelector
              accounts={accounts}
              activeAccountId={accountId}
              onSelect={onAccountChange}
            />
          )}
          <ZoneSelector
            zones={zones}
            activeZoneId={zoneId}
            onSelect={onZoneChange}
            loading={zonesLoading}
          />
        </div>

        {!zoneId ? (
          <p className="text-sm text-muted-foreground">请先选择域名</p>
        ) : (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">一键清除</CardTitle>
                <CardDescription>清除该域名下的所有缓存文件，操作不可撤销。</CardDescription>
              </CardHeader>
              <CardContent>
                {disabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block">
                        <Button variant="destructive" disabled>
                          <Trash2 className="mr-2 h-4 w-4" />
                          清除全站缓存
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>需要 ADMIN 权限</TooltipContent>
                  </Tooltip>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={purgingAll}>
                        {purgingAll ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        清除全站缓存
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认清除全站缓存？</AlertDialogTitle>
                        <AlertDialogDescription>
                          此操作将清除该域名下所有缓存，访客在缓存重建前将直接请求源站，可能短暂影响性能。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePurgeAll}>确认清除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">按 URL 清除</CardTitle>
                <CardDescription>每行输入一个完整 URL，仅清除对应资源的缓存。</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {disabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col gap-3">
                        <Textarea
                          placeholder="https://example.com/path/to/file.js"
                          rows={5}
                          disabled
                          className="font-mono text-sm resize-none"
                        />
                        <Button variant="outline" disabled>
                          清除指定缓存
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>需要 ADMIN 权限</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Textarea
                      placeholder="https://example.com/path/to/file.js"
                      rows={5}
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="font-mono text-sm resize-none"
                      disabled={purgingUrls}
                    />
                    <Button
                      variant="outline"
                      onClick={handlePurgeUrls}
                      disabled={purgingUrls || !urlInput.trim()}
                      className="self-start"
                    >
                      {purgingUrls && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      清除指定缓存
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
