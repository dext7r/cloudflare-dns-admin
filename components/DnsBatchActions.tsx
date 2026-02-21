"use client"

import { Button } from "@/components/ui/button"
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
import { Trash2, X } from "lucide-react"

interface DnsBatchActionsProps {
  selectedCount: number
  onBatchDelete: () => void
  onClearSelection: () => void
  loading?: boolean
}

export function DnsBatchActions({
  selectedCount,
  onBatchDelete,
  onClearSelection,
  loading,
}: DnsBatchActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-3 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2.5 animate-in slide-in-from-bottom-2">
      <span className="text-sm font-medium text-primary">
        已选择 {selectedCount} 条记录
      </span>
      <div className="flex items-center gap-2 ml-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              className="h-8"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              批量删除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认批量删除</AlertDialogTitle>
              <AlertDialogDescription>
                即将删除 {selectedCount} 条 DNS 记录，此操作不可撤销。确定继续吗？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={onBatchDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 text-muted-foreground"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          取消选择
        </Button>
      </div>
    </div>
  )
}
