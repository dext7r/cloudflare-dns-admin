import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DnsManager } from "@/components/DnsManager"
import { AdminShell } from "@/components/AdminShell"

export default async function Page() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const protectedZones = (process.env.PROTECTED_ZONES ?? "")
    .split(",").map(s => s.trim()).filter(Boolean)

  return (
    <AdminShell role={session.user.role} user={session.user}>
      <DnsManager role={session.user.role} protectedZones={protectedZones} />
    </AdminShell>
  )
}
