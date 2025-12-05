import * as React from "react"
import { redirect } from "next/navigation"

import SignOutButton from "@/components/features/auth/sign-out-button"
import AppSidebar from "@/components/layouts/dashboard/app-sidebar"
import Topbar from "@/components/layouts/dashboard/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getSession } from "@/lib/auth/server"

export default async function ProtectedLayout({
  children,
  dialog,
}: {
  children: React.ReactNode
  dialog: React.ReactNode
}) {
  const session = await getSession()

  const isStaffOrAdmin =
    session?.user.role === "member" || session?.user.role === "admin"

  if (!session) {
    redirect("/auth/sign-in")
  }

  if (!isStaffOrAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <SignOutButton />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
            {dialog}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
