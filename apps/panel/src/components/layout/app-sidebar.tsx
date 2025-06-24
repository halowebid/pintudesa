"use client"

import * as React from "react"
import type { SelectUser } from "@pintudesa/db/schema"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@pintudesa/ui"

import NavMain from "@/components/layout/nav-main"
import NavUser from "@/components/layout/nav-user"
import Link from "@/components/link"
import { siteTitle } from "@/lib/utils/env"
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
    navBukuAdministrasiUmum: [
      {
        name: "A1. Buku Peraturan Desa",
        url: "/buku-a1",
        icon: "Settings" as const,
      },
      {
        name: "A2. Buku Keputusan Kepala Desa",
        url: "/buku-a2",
        icon: "DollarSign" as const,
        disabled: true,
      },
      {
        name: "A3. Buku Inventaris Desa",
        url: "/buku-a3",
        icon: "Archive" as const,
      },
      {
        name: "A4. Buku Aparat Pemerintah Desa",
        url: "/buku-a4",
        icon: "MapPin" as const,
        disabled: true,
      },
      {
        name: "A5. Buku Tanah Kas Desa",
        url: "/buku-a5",
        icon: "Calendar" as const,
      },
      {
        name: "A6. Buku Tanah Desa",
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
        name: "A9. Buku Lembaran Desa",
        url: "/buku-a9",
        icon: "Globe" as const,
      },
    ],
    navBukuAdministrasiPenduduk: [
      {
        name: "B1. Buku Induk Penduduk Desa",
        url: "/buku-b1",
        icon: "Settings" as const,
        disabled: true,
      },
      {
        name: "B2. Buku Mutasi Penduduk Desa",
        url: "/buku-b2",
        icon: "DollarSign" as const,
        disabled: true,
      },
      {
        name: "B3. Buku Rekapitulasi Jumlah Penduduk Desa",
        url: "/buku-b3",
        icon: "Archive" as const,
        disabled: true,
      },
      {
        name: "B4. Buku Penduduk Sementara",
        url: "/buku-b4",
        icon: "MapPin" as const,
        disabled: true,
      },
      {
        name: "B5. Buku KTP dan Kartu Keluarga",
        url: "/buku-b5",
        icon: "Calendar" as const,
        disabled: true,
      },
    ],
    navBukuAdministrasiKeuangan: [
      {
        name: "C1. Buku Anggaran Pendapatan dan Belanja Desa",
        url: "/buku-c1",
        icon: "Settings" as const,
        disabled: true,
      },
      {
        name: "C2. Buku Rencana Anggaran Biaya Desa",
        url: "/buku-c2",
        icon: "DollarSign" as const,
      },
      {
        name: "C3. Buku Kas Pembantu Kegiatan",
        url: "/buku-c3",
        icon: "Archive" as const,
        disabled: true,
      },
      {
        name: "C4. Buku Kas Umum",
        url: "/buku-c4",
        icon: "MapPin" as const,
        disabled: true,
      },
      {
        name: "C5. Buku Kas Pembantu",
        url: "/buku-c5",
        icon: "Calendar" as const,
        disabled: true,
      },
      {
        name: "C6. Buku Bank Desa",
        url: "/buku-c6",
        icon: "Calendar" as const,
        disabled: true,
      },
    ],
    navBukuAdministrasiPembangunan: [
      {
        name: "D1. Buku Rencana Kerja Pembangunan Desa",
        url: "/buku-d1",
        icon: "Settings" as const,
      },
      {
        name: "D2. Buku Kegiatan Pembangunan Desa",
        url: "/buku-d2",
        icon: "DollarSign" as const,
      },
      {
        name: "D3. Buku Inventaris Hasil-hasil Pembangunan Desa",
        url: "/buku-d3",
        icon: "Archive" as const,
      },
      {
        name: "D4. Buku Kader Pemberdayaan Masyarakat Desa",
        url: "/buku-d4",
        icon: "MapPin" as const,
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
        <SidebarGroup>
          <SidebarGroupLabel>Buku Administrasi</SidebarGroupLabel>
          <NavCollapsible
            items={data.navBukuAdministrasiUmum}
            label="Buku Administrasi Umum"
          />
          <NavCollapsible
            items={data.navBukuAdministrasiPenduduk}
            label="Buku Administrasi Penduduk"
          />
          <NavCollapsible
            items={data.navBukuAdministrasiKeuangan}
            label="Buku Administrasi Keuangan"
          />
          <NavCollapsible
            items={data.navBukuAdministrasiPembangunan}
            label="Buku Administrasi Pembangunan"
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
