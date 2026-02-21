import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { WorkersRoutesManager } from "./WorkersRoutesManager"

export default async function WorkersRoutesPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <WorkersRoutesManager role={session.user.role} />
    </AdminShell>
  )
}
