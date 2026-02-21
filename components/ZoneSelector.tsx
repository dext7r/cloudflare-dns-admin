"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Globe, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import type { Zone } from "@/lib/dns-types"

interface ZoneSelectorProps {
  zones: Zone[]
  activeZoneId: string | null
  onSelect: (zoneId: string) => void
  loading?: boolean
}

export function ZoneSelector({ zones, activeZoneId, onSelect, loading }: ZoneSelectorProps) {
  const [open, setOpen] = useState(false)
  const activeZone = zones.find((z) => z.id === activeZoneId)

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-1 py-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">加载域名列表...</span>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 min-w-[220px] max-w-sm justify-between gap-2 border-border/50 bg-background/50 font-normal"
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {activeZone ? (
              <span className="truncate text-sm">{activeZone.name}</span>
            ) : (
              <span className="text-sm text-muted-foreground">选择域名...</span>
            )}
            {activeZone && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 shrink-0",
                  activeZone.status === "active"
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-amber-500/30 text-amber-400"
                )}
              >
                {activeZone.status === "active" ? "活跃" : activeZone.status}
              </Badge>
            )}
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="搜索域名..." className="h-9" />
          <CommandEmpty>未找到域名</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {zones.map((zone) => (
              <CommandItem
                key={zone.id}
                value={zone.name}
                onSelect={() => {
                  onSelect(zone.id)
                  setOpen(false)
                }}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    activeZoneId === zone.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{zone.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0 shrink-0",
                    zone.status === "active"
                      ? "border-emerald-500/30 text-emerald-400"
                      : "border-amber-500/30 text-amber-400"
                  )}
                >
                  {zone.status === "active" ? "活跃" : zone.status}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
