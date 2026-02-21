"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <Button variant="ghost" className="h-8 w-8 p-0" disabled aria-label="切换主题" />
  }

  return (
    <Button
      variant="ghost"
      className="relative h-8 w-8 p-0"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="切换主题"
    >
      <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
