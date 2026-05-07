import { Suspense } from "react"
import { UsersPageClient } from "@/components/users/users-page-client"

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
      <UsersPageClient />
    </Suspense>
  )
}