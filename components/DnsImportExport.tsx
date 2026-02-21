"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2 } from "lucide-react"

interface DnsImportExportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (content: string) => Promise<void>
}

export function DnsImportDialog({
  open,
  onOpenChange,
  onImport,
}: DnsImportExportProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImport() {
    if (!content.trim()) return
    setLoading(true)
    try {
      await onImport(content)
      setContent("")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setContent(ev.target?.result as string)
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>导入 DNS 记录</DialogTitle>
          <DialogDescription>
            上传 BIND zone 格式的文件或直接粘贴内容
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.zone,.bind"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-20 border-dashed"
            >
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  点击选择文件或拖拽上传
                </span>
              </div>
            </Button>
          </div>
          <Textarea
            placeholder={"粘贴 BIND zone 格式的 DNS 记录...\n\n例如:\nexample.com. 300 IN A 192.0.2.1\nwww.example.com. 300 IN CNAME example.com."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || !content.trim()}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
