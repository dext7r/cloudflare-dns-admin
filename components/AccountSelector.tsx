"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Key, Check, ChevronsUpDown } from "lucide-react"

interface CfAccount {
  id: string
  name: string
}

interface AccountSelectorProps {
  accounts: CfAccount[]
  activeAccountId: string | null
  onSelect: (id: string | null) => void
}

export function AccountSelector({ accounts, activeAccountId, onSelect }: AccountSelectorProps) {
  const [open, setOpen] = useState(false)
  const activeAccount = accounts.find((a) => a.id === activeAccountId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 justify-between gap-2 border-border/50 bg-background/50"
        >
          <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm truncate max-w-[160px]">
            {activeAccount?.name ?? "默认账号"}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="搜索账号..." />
          <CommandEmpty>未找到账号</CommandEmpty>
          <CommandGroup>
            <CommandItem
              value="__default__"
              onSelect={() => { onSelect(null); setOpen(false) }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  activeAccountId === null ? "opacity-100" : "opacity-0"
                )}
              />
              默认账号
            </CommandItem>
            {accounts.map((account) => (
              <CommandItem
                key={account.id}
                value={account.name}
                onSelect={() => { onSelect(account.id); setOpen(false) }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    activeAccountId === account.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {account.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
