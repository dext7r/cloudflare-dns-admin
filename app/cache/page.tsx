import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { CacheManagerClient } from "./CacheManagerClient"

export default async function CacheManagerPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <CacheManagerClient role={session.user.role} />
    </AdminShell>
  )
}
