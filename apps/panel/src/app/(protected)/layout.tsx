import * as React from "react"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@pintudesa/ui"

// import LogOutButton from "@/components/auth/logout-button"
import AppSidebar from "@/components/layout/app-sidebar"
import Topbar from "@/components/layout/topbar"
import { getSession } from "@/lib/auth/server"

export default async function ProtectedLayout({
  children,
  dialog,
}: {
  children: React.ReactNode
  dialog: React.ReactNode
}) {
  const session = await getSession()

  // const isAdmin = user?.role === "admin"

  if (!session) {
    redirect("/auth/sign-in")
  }

  // if (!isAdmin) {
  //   return (
  //     <div className="flex h-screen flex-col items-center justify-center space-y-4">
  //       <h1 className="text-3xl font-bold">Access Denied</h1>
  //       <LogOutButton />
  //     </div>
  //   )
  // }

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
