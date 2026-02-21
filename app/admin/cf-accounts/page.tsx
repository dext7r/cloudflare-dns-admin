import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CfAccountManager } from "./CfAccountManager"
import { AdminShell } from "@/components/AdminShell"

export default async function AdminCfAccountsPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <AdminShell role={session.user.role} user={session.user}>
      <CfAccountManager />
    </AdminShell>
  )
}
