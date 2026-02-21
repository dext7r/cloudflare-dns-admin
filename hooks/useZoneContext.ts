"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import type { Zone } from "@/lib/dns-types"

interface CfAccount { id: string; name: string }

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function useZoneContext() {
  const [accountId, setAccountId] = useState<string | null>(null)
  const [zoneId, setZoneId] = useState<string | null>(null)

  const { data: accountsData } = useSWR<{ success: boolean; result: CfAccount[] }>(
    "/api/admin/cf-accounts",
    fetcher
  )
  const accounts = accountsData?.result ?? []
  const accountsReady = !!accountsData
  const noAccounts = accountsReady && accounts.length === 0

  const zonesUrl = (accountId !== null || noAccounts)
    ? `/api/cloudflare/zones?accountId=${accountId ?? ""}`
    : null
  const { data: zonesData, error: zonesError, isLoading: zonesLoading } =
    useSWR<{ success: boolean; result: Zone[] }>(zonesUrl, fetcher)
  const zones = zonesData?.result ?? []

  useEffect(() => {
    if (zones.length > 0 && !zoneId) setZoneId(zones[0].id)
  }, [zones, zoneId])

  function onAccountChange(id: string | null) {
    setAccountId(id)
    setZoneId(null)
  }

  const activeZone = zones.find((z) => z.id === zoneId)

  return {
    accountId,
    zoneId,
    accounts,
    zones,
    activeZone,
    zonesLoading,
    zonesError,
    onAccountChange,
    onZoneChange: setZoneId,
  }
}
