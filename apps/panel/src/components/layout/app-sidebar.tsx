"use client"

import * as React from "react"
import type { Session } from "@pintudesa/auth"
import { siteTitle } from "@pintudesa/env"
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
import NavCollapsible from "./nav-collapsible"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Session["user"]
}

const AppSidebar = (props: AppSidebarProps) => {
  const data = {
    navMain: [
      {
        name: "Ringkasan",
        url: "/",
      },
      {
        name: "Pengaturan",
        url: "/setting",
      },
      {
        name: "Pengguna",
        url: "/user",
      },
    ],
    navKependudukan: [
      {
        name: "Kartu Keluarga",
        url: "/kartu-keluarga",
        disbaled: true,
      },
      {
        name: "Penduduk",
        url: "/penduduk",
      },
    ],

    navBukuAdministrasiUmum: [
      {
        name: "A1. Buku Peraturan Desa",
        url: "/buku-a1",
      },
      {
        name: "A2. Buku Keputusan Kepala Desa",
        url: "/buku-a2",
      },
      {
        name: "A3. Buku Inventaris Desa",
        url: "/buku-a3",
      },
      {
        name: "A4. Buku Aparat Pemerintah Desa",
        url: "/buku-a4",
        disabled: true,
      },
      {
        name: "A5. Buku Tanah Kas Desa",
        url: "/buku-a5",
      },
      {
        name: "A6. Buku Tanah Desa",
        url: "/buku-a6",
      },
      {
        name: "A7. Buku Agenda Desa",
        url: "/buku-a7",
      },
      {
        name: "A8. Buku Ekspedisi Desa",
        url: "/buku-a8",
      },
      {
        name: "A9. Buku Lembaran Desa",
        url: "/buku-a9",
      },
    ],
    navBukuAdministrasiPenduduk: [
      {
        name: "B1. Buku Induk Penduduk Desa",
        url: "/buku-b1",
        disabled: true,
      },
      {
        name: "B2. Buku Mutasi Penduduk Desa",
        url: "/buku-b2",
        disabled: true,
      },
      {
        name: "B3. Buku Rekapitulasi Jumlah Penduduk Desa",
        url: "/buku-b3",
        disabled: true,
      },
      {
        name: "B4. Buku Penduduk Sementara",
        url: "/buku-b4",
      },
      {
        name: "B5. Buku KTP dan Kartu Keluarga",
        url: "/buku-b5",
        disabled: true,
      },
    ],
    navBukuAdministrasiKeuangan: [
      {
        name: "C1. Buku Anggaran Pendapatan dan Belanja Desa",
        url: "/buku-c1",
        disabled: true,
      },
      {
        name: "C2. Buku Rencana Anggaran Biaya Desa",
        url: "/buku-c2",
      },
      {
        name: "C3. Buku Kas Pembantu Kegiatan",
        url: "/buku-c3",
        disabled: true,
      },
      {
        name: "C4. Buku Kas Umum",
        url: "/buku-c4",
        disabled: true,
      },
      {
        name: "C5. Buku Kas Pembantu",
        url: "/buku-c5",
        disabled: true,
      },
      {
        name: "C6. Buku Bank Desa",
        url: "/buku-c6",
        disabled: true,
      },
    ],
    navBukuAdministrasiPembangunan: [
      {
        name: "D1. Buku Rencana Kerja Pembangunan Desa",
        url: "/buku-d1",
      },
      {
        name: "D2. Buku Kegiatan Pembangunan Desa",
        url: "/buku-d2",
      },
      {
        name: "D3. Buku Inventaris Hasil-hasil Pembangunan Desa",
        url: "/buku-d3",
      },
      {
        name: "D4. Buku Kader Pemberdayaan Masyarakat Desa",
        url: "/buku-d4",
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
        <NavMain label="Menu" items={data.navMain} />
        <NavMain label="Kependudukan" items={data.navKependudukan} />
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
