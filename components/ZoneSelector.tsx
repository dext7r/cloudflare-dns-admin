"use client"

import type { Zone } from "@/lib/dns-types"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Globe, Loader2 } from "lucide-react"

interface ZoneSelectorProps {
  zones: Zone[]
  activeZoneId: string | null
  onSelect: (zoneId: string) => void
  loading?: boolean
}

export function ZoneSelector({
  zones,
  activeZoneId,
  onSelect,
  loading,
}: ZoneSelectorProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-1 py-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">加载域名列表...</span>
      </div>
    )
  }

  if (zones.length === 0) {
    return (
      <div className="flex items-center gap-2 px-1 py-2 text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span className="text-sm">未找到任何域名</span>
      </div>
    )
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex items-center gap-1 pb-1">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onSelect(zone.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              "hover:bg-accent/80",
              activeZoneId === zone.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground border border-transparent"
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{zone.name}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5 py-0",
                zone.status === "active"
                  ? "border-emerald-500/30 text-emerald-400"
                  : "border-amber-500/30 text-amber-400"
              )}
            >
              {zone.status === "active" ? "活跃" : zone.status}
            </Badge>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
