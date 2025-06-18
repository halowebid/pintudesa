"use client"

import * as React from "react"

import NavMain from "@/components/layout/nav-main"
import NavUser from "@/components/layout/nav-user"
import Link from "@/components/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { SelectUser } from "@/lib/db/schema/user"
import { siteTitle } from "@/lib/env/client"
import NavCollapsible from "./nav-collapsible"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SelectUser
}

const AppSidebar = (props: AppSidebarProps) => {
  const data = {
    navMain: [
      {
        name: "Ringkasan",
        url: "/",
        icon: "Gauge" as const,
      },
      {
        name: "Pengguna",
        url: "/user",
        icon: "Users" as const,
      },
    ],
    navBuku: [
      {
        name: "A1. Buku Peraturan Desa",
        url: "/buku-a1",
        icon: "Settings" as const,
      },
      {
        name: "A2. Buku Keuangan Desa",
        url: "/buku-a2",
        icon: "DollarSign" as const,
      },
      {
        name: "A3. Buku Inventaris Desa",
        url: "/buku-a3",
        icon: "Archive" as const,
      },
      {
        name: "A4. Buku Tanah Desa",
        url: "/buku-a4",
        icon: "MapPin" as const,
      },
      {
        name: "A5. Buku Peristiwa Desa",
        url: "/buku-a5",
        icon: "Calendar" as const,
      },
      {
        name: "A6. Buku Keluarga Desa",
        url: "/buku-a6",
        icon: "Users" as const,
      },
      {
        name: "A7. Buku Agenda Desa",
        url: "/buku-a7",
        icon: "Users" as const,
      },
      {
        name: "A8. Buku Ekspedisi Desa",
        url: "/buku-a8",
        icon: "BookOpen" as const,
      },
      {
        name: "A9. Buku Kewarganegaraan Desa",
        url: "/buku-a9",
        icon: "Globe" as const,
      },
    ],
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{siteTitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCollapsible items={data.navBuku} label="Administrasi" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
