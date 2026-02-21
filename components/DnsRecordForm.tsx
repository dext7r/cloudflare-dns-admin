"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ALL_RECORD_TYPES,
  TTL_OPTIONS,
  type DnsRecord,
  type DnsRecordType,
  type CreateDnsRecordRequest,
} from "@/lib/dns-types"
import { Loader2 } from "lucide-react"

interface DnsRecordFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateDnsRecordRequest) => Promise<void>
  editRecord?: DnsRecord | null
  zoneName?: string
}

const PROXIABLE_TYPES: DnsRecordType[] = ["A", "AAAA", "CNAME"]

export function DnsRecordForm({
  open,
  onOpenChange,
  onSubmit,
  editRecord,
  zoneName,
}: DnsRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<DnsRecordType>("A")
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [ttl, setTtl] = useState(1)
  const [proxied, setProxied] = useState(false)
  const [priority, setPriority] = useState(10)
  const [comment, setComment] = useState("")

  // SRV data
  const [srvService, setSrvService] = useState("")
  const [srvProto, setSrvProto] = useState("_tcp")
  const [srvPriority, setSrvPriority] = useState(0)
  const [srvWeight, setSrvWeight] = useState(0)
  const [srvPort, setSrvPort] = useState(0)
  const [srvTarget, setSrvTarget] = useState("")

  // CAA data
  const [caaFlags, setCaaFlags] = useState(0)
  const [caaTag, setCaaTag] = useState("issue")
  const [caaValue, setCaaValue] = useState("")

  // SSHFP data
  const [sshfpAlgo, setSshfpAlgo] = useState(1)
  const [sshfpType, setSshfpType] = useState(1)
  const [sshfpFingerprint, setSshfpFingerprint] = useState("")

  // TLSA/SMIMEA data
  const [tlsaUsage, setTlsaUsage] = useState(0)
  const [tlsaSelector, setTlsaSelector] = useState(0)
  const [tlsaMatchingType, setTlsaMatchingType] = useState(0)
  const [tlsaCertificate, setTlsaCertificate] = useState("")

  // URI data
  const [uriTarget, setUriTarget] = useState("")
  const [uriWeight, setUriWeight] = useState(0)
  const [uriPriority, setUriPriority] = useState(0)

  // LOC data
  const [locLatDeg, setLocLatDeg] = useState(0)
  const [locLatMin, setLocLatMin] = useState(0)
  const [locLatSec, setLocLatSec] = useState(0)
  const [locLatDir, setLocLatDir] = useState("N")
  const [locLongDeg, setLocLongDeg] = useState(0)
  const [locLongMin, setLocLongMin] = useState(0)
  const [locLongSec, setLocLongSec] = useState(0)
  const [locLongDir, setLocLongDir] = useState("E")
  const [locAlt, setLocAlt] = useState(0)
  const [locSize, setLocSize] = useState(0)

  // NAPTR data
  const [naptrOrder, setNaptrOrder] = useState(0)
  const [naptrPref, setNaptrPref] = useState(0)
  const [naptrFlags, setNaptrFlags] = useState("")
  const [naptrService, setNaptrService] = useState("")
  const [naptrRegex, setNaptrRegex] = useState("")
  const [naptrReplacement, setNaptrReplacement] = useState("")

  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type)
      setName(editRecord.name.replace(`.${zoneName || ""}`, ""))
      setContent(editRecord.content)
      setTtl(editRecord.ttl)
      setProxied(editRecord.proxied)
      setPriority(editRecord.priority || 10)
      setComment(editRecord.comment || "")

      const d = editRecord.data as Record<string, unknown> | undefined
      if (d) {
        switch (editRecord.type) {
          case "SRV":
            setSrvService(String(d.service || ""))
            setSrvProto(String(d.proto || "_tcp"))
            setSrvPriority(Number(d.priority || 0))
            setSrvWeight(Number(d.weight || 0))
            setSrvPort(Number(d.port || 0))
            setSrvTarget(String(d.target || ""))
            break
          case "CAA":
            setCaaFlags(Number(d.flags || 0))
            setCaaTag(String(d.tag || "issue"))
            setCaaValue(String(d.value || ""))
            break
          case "SSHFP":
            setSshfpAlgo(Number(d.algorithm || 1))
            setSshfpType(Number(d.type || 1))
            setSshfpFingerprint(String(d.fingerprint || ""))
            break
          case "TLSA":
          case "SMIMEA":
            setTlsaUsage(Number(d.usage || 0))
            setTlsaSelector(Number(d.selector || 0))
            setTlsaMatchingType(Number(d.matching_type || 0))
            setTlsaCertificate(String(d.certificate || ""))
            break
          case "URI":
            setUriTarget(String(d.target || ""))
            setUriWeight(Number(d.weight || 0))
            setUriPriority(Number(d.priority || 0))
            break
          case "LOC":
            setLocLatDeg(Number(d.lat_degrees || 0))
            setLocLatMin(Number(d.lat_minutes || 0))
            setLocLatSec(Number(d.lat_seconds || 0))
            setLocLatDir(String(d.lat_direction || "N"))
            setLocLongDeg(Number(d.long_degrees || 0))
            setLocLongMin(Number(d.long_minutes || 0))
            setLocLongSec(Number(d.long_seconds || 0))
            setLocLongDir(String(d.long_direction || "E"))
            setLocAlt(Number(d.altitude || 0))
            setLocSize(Number(d.size || 0))
            break
          case "NAPTR":
            setNaptrOrder(Number(d.order || 0))
            setNaptrPref(Number(d.preference || 0))
            setNaptrFlags(String(d.flags || ""))
            setNaptrService(String(d.service || ""))
            setNaptrRegex(String(d.regex || ""))
            setNaptrReplacement(String(d.replacement || ""))
            break
        }
      }
    } else {
      resetForm()
    }
  }, [editRecord, zoneName])

  function resetForm() {
    setType("A")
    setName("")
    setContent("")
    setTtl(1)
    setProxied(false)
    setPriority(10)
    setComment("")
    setSrvService("")
    setSrvProto("_tcp")
    setSrvPriority(0)
    setSrvWeight(0)
    setSrvPort(0)
    setSrvTarget("")
    setCaaFlags(0)
    setCaaTag("issue")
    setCaaValue("")
    setSshfpAlgo(1)
    setSshfpType(1)
    setSshfpFingerprint("")
    setTlsaUsage(0)
    setTlsaSelector(0)
    setTlsaMatchingType(0)
    setTlsaCertificate("")
    setUriTarget("")
    setUriWeight(0)
    setUriPriority(0)
    setLocLatDeg(0)
    setLocLatMin(0)
    setLocLatSec(0)
    setLocLatDir("N")
    setLocLongDeg(0)
    setLocLongMin(0)
    setLocLongSec(0)
    setLocLongDir("E")
    setLocAlt(0)
    setLocSize(0)
    setNaptrOrder(0)
    setNaptrPref(0)
    setNaptrFlags("")
    setNaptrService("")
    setNaptrRegex("")
    setNaptrReplacement("")
  }

  function buildRequestData(): CreateDnsRecordRequest {
    const base: CreateDnsRecordRequest = {
      type,
      name,
      content,
      ttl,
      comment: comment || undefined,
    }

    if (PROXIABLE_TYPES.includes(type)) {
      base.proxied = proxied
    }

    switch (type) {
      case "MX":
        base.priority = priority
        break
      case "SRV":
        base.data = {
          service: srvService,
          proto: srvProto,
          name,
          priority: srvPriority,
          weight: srvWeight,
          port: srvPort,
          target: srvTarget,
        }
        break
      case "CAA":
        base.data = {
          flags: caaFlags,
          tag: caaTag,
          value: caaValue,
        }
        break
      case "SSHFP":
        base.data = {
          algorithm: sshfpAlgo,
          type: sshfpType,
          fingerprint: sshfpFingerprint,
        }
        break
      case "TLSA":
      case "SMIMEA":
        base.data = {
          usage: tlsaUsage,
          selector: tlsaSelector,
          matching_type: tlsaMatchingType,
          certificate: tlsaCertificate,
        }
        break
      case "URI":
        base.data = {
          target: uriTarget,
          weight: uriWeight,
          priority: uriPriority,
        }
        break
      case "LOC":
        base.data = {
          lat_degrees: locLatDeg,
          lat_minutes: locLatMin,
          lat_seconds: locLatSec,
          lat_direction: locLatDir,
          long_degrees: locLongDeg,
          long_minutes: locLongMin,
          long_seconds: locLongSec,
          long_direction: locLongDir,
          altitude: locAlt,
          size: locSize,
          precision_horz: 0,
          precision_vert: 0,
        }
        break
      case "NAPTR":
        base.data = {
          order: naptrOrder,
          preference: naptrPref,
          flags: naptrFlags,
          service: naptrService,
          regex: naptrRegex,
          replacement: naptrReplacement,
        }
        break
    }

    return base
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(buildRequestData())
      onOpenChange(false)
      resetForm()
    } finally {
      setLoading(false)
    }
  }

  function renderTypeFields() {
    switch (type) {
      case "A":
      case "AAAA":
        return (
          <FormField label={type === "A" ? "IPv4 地址" : "IPv6 地址"}>
            <Input
              placeholder={type === "A" ? "192.0.2.1" : "2001:db8::1"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FormField>
        )
      case "CNAME":
        return (
          <FormField label="目标">
            <Input
              placeholder="example.com"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FormField>
        )
      case "MX":
        return (
          <>
            <FormField label="邮件服务器">
              <Input
                placeholder="mail.example.com"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </FormField>
            <FormField label="优先级">
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min={0}
                max={65535}
              />
            </FormField>
          </>
        )
      case "TXT":
        return (
          <FormField label="内容">
            <Textarea
              placeholder="v=spf1 include:_spf.example.com ~all"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
            />
          </FormField>
        )
      case "NS":
        return (
          <FormField label="域名服务器">
            <Input
              placeholder="ns1.example.com"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </FormField>
        )
      case "SRV":
        return (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="服务">
              <Input
                placeholder="_sip"
                value={srvService}
                onChange={(e) => setSrvService(e.target.value)}
              />
            </FormField>
            <FormField label="协议">
              <Select value={srvProto} onValueChange={setSrvProto}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_tcp">TCP</SelectItem>
                  <SelectItem value="_udp">UDP</SelectItem>
                  <SelectItem value="_tls">TLS</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="优先级">
              <Input type="number" value={srvPriority} onChange={(e) => setSrvPriority(Number(e.target.value))} min={0} />
            </FormField>
            <FormField label="权重">
              <Input type="number" value={srvWeight} onChange={(e) => setSrvWeight(Number(e.target.value))} min={0} />
            </FormField>
            <FormField label="端口">
              <Input type="number" value={srvPort} onChange={(e) => setSrvPort(Number(e.target.value))} min={0} max={65535} />
            </FormField>
            <FormField label="目标">
              <Input placeholder="sip.example.com" value={srvTarget} onChange={(e) => setSrvTarget(e.target.value)} />
            </FormField>
          </div>
        )
      case "CAA":
        return (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="标志位">
              <Input type="number" value={caaFlags} onChange={(e) => setCaaFlags(Number(e.target.value))} min={0} max={255} />
            </FormField>
            <FormField label="标签">
              <Select value={caaTag} onValueChange={setCaaTag}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue">issue</SelectItem>
                  <SelectItem value="issuewild">issuewild</SelectItem>
                  <SelectItem value="iodef">iodef</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <div className="col-span-2">
              <FormField label="值">
                <Input placeholder="letsencrypt.org" value={caaValue} onChange={(e) => setCaaValue(e.target.value)} />
              </FormField>
            </div>
          </div>
        )
      case "SSHFP":
        return (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="算法">
              <Select value={String(sshfpAlgo)} onValueChange={(v) => setSshfpAlgo(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">RSA (1)</SelectItem>
                  <SelectItem value="2">DSA (2)</SelectItem>
                  <SelectItem value="3">ECDSA (3)</SelectItem>
                  <SelectItem value="4">Ed25519 (4)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="类型">
              <Select value={String(sshfpType)} onValueChange={(v) => setSshfpType(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">SHA-1 (1)</SelectItem>
                  <SelectItem value="2">SHA-256 (2)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <div className="col-span-2">
              <FormField label="指纹">
                <Input placeholder="指纹哈希值" value={sshfpFingerprint} onChange={(e) => setSshfpFingerprint(e.target.value)} />
              </FormField>
            </div>
          </div>
        )
      case "TLSA":
      case "SMIMEA":
        return (
          <div className="grid grid-cols-3 gap-3">
            <FormField label="用途">
              <Input type="number" value={tlsaUsage} onChange={(e) => setTlsaUsage(Number(e.target.value))} min={0} max={3} />
            </FormField>
            <FormField label="选择器">
              <Input type="number" value={tlsaSelector} onChange={(e) => setTlsaSelector(Number(e.target.value))} min={0} max={1} />
            </FormField>
            <FormField label="匹配类型">
              <Input type="number" value={tlsaMatchingType} onChange={(e) => setTlsaMatchingType(Number(e.target.value))} min={0} max={2} />
            </FormField>
            <div className="col-span-3">
              <FormField label="证书数据">
                <Textarea placeholder="证书关联数据" value={tlsaCertificate} onChange={(e) => setTlsaCertificate(e.target.value)} rows={2} />
              </FormField>
            </div>
          </div>
        )
      case "URI":
        return (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="优先级">
              <Input type="number" value={uriPriority} onChange={(e) => setUriPriority(Number(e.target.value))} min={0} />
            </FormField>
            <FormField label="权重">
              <Input type="number" value={uriWeight} onChange={(e) => setUriWeight(Number(e.target.value))} min={0} />
            </FormField>
            <div className="col-span-2">
              <FormField label="目标 URI">
                <Input placeholder="https://example.com" value={uriTarget} onChange={(e) => setUriTarget(e.target.value)} />
              </FormField>
            </div>
          </div>
        )
      case "LOC":
        return (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">纬度</p>
            <div className="grid grid-cols-4 gap-2">
              <FormField label="度"><Input type="number" value={locLatDeg} onChange={(e) => setLocLatDeg(Number(e.target.value))} /></FormField>
              <FormField label="分"><Input type="number" value={locLatMin} onChange={(e) => setLocLatMin(Number(e.target.value))} /></FormField>
              <FormField label="秒"><Input type="number" value={locLatSec} onChange={(e) => setLocLatSec(Number(e.target.value))} step="0.001" /></FormField>
              <FormField label="方向">
                <Select value={locLatDir} onValueChange={setLocLatDir}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">N</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <p className="text-xs text-muted-foreground">经度</p>
            <div className="grid grid-cols-4 gap-2">
              <FormField label="度"><Input type="number" value={locLongDeg} onChange={(e) => setLocLongDeg(Number(e.target.value))} /></FormField>
              <FormField label="分"><Input type="number" value={locLongMin} onChange={(e) => setLocLongMin(Number(e.target.value))} /></FormField>
              <FormField label="秒"><Input type="number" value={locLongSec} onChange={(e) => setLocLongSec(Number(e.target.value))} step="0.001" /></FormField>
              <FormField label="方向">
                <Select value={locLongDir} onValueChange={setLocLongDir}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="W">W</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="海拔 (m)"><Input type="number" value={locAlt} onChange={(e) => setLocAlt(Number(e.target.value))} /></FormField>
              <FormField label="大小 (m)"><Input type="number" value={locSize} onChange={(e) => setLocSize(Number(e.target.value))} /></FormField>
            </div>
          </div>
        )
      case "NAPTR":
        return (
          <div className="grid grid-cols-2 gap-3">
            <FormField label="顺序"><Input type="number" value={naptrOrder} onChange={(e) => setNaptrOrder(Number(e.target.value))} min={0} /></FormField>
            <FormField label="优先级"><Input type="number" value={naptrPref} onChange={(e) => setNaptrPref(Number(e.target.value))} min={0} /></FormField>
            <FormField label="标志"><Input value={naptrFlags} onChange={(e) => setNaptrFlags(e.target.value)} placeholder="S, A, U, P" /></FormField>
            <FormField label="服务"><Input value={naptrService} onChange={(e) => setNaptrService(e.target.value)} /></FormField>
            <FormField label="正则表达式"><Input value={naptrRegex} onChange={(e) => setNaptrRegex(e.target.value)} /></FormField>
            <FormField label="替换"><Input value={naptrReplacement} onChange={(e) => setNaptrReplacement(e.target.value)} /></FormField>
          </div>
        )
      default:
        return null
    }
  }

  const isDataType = ["SRV", "CAA", "LOC", "NAPTR", "SSHFP", "TLSA", "SMIMEA", "URI"].includes(type)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editRecord ? "编辑 DNS 记录" : "添加 DNS 记录"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="类型">
            <Select
              value={type}
              onValueChange={(v) => setType(v as DnsRecordType)}
              disabled={!!editRecord}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_RECORD_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {!isDataType && (
            <FormField label="名称">
              <Input
                placeholder="@ 或子域名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {zoneName && (
                <p className="text-xs text-muted-foreground mt-1">
                  {"完整域名: "}{name || "@"}.{zoneName}
                </p>
              )}
            </FormField>
          )}

          {isDataType && type !== "SRV" && (
            <FormField label="名称">
              <Input
                placeholder="@ 或子域名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
          )}

          {renderTypeFields()}

          {PROXIABLE_TYPES.includes(type) && (
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div>
                <Label className="text-sm font-medium">代理状态</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  通过 Cloudflare 网络代理流量
                </p>
              </div>
              <Switch checked={proxied} onCheckedChange={setProxied} />
            </div>
          )}

          <FormField label="TTL">
            <Select
              value={String(ttl)}
              onValueChange={(v) => setTtl(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TTL_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="备注（可选）">
            <Input
              placeholder="添加备注..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editRecord ? "更新" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}
