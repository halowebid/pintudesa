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
        url: "/buku/peraturan-desa",
      },
      {
        name: "A2. Buku Keputusan Kepala Desa",
        url: "/keputusan-kepala-desa",
      },
      {
        name: "A3. Buku Inventaris Desa",
        url: "/buku/buku-a3",
      },
      {
        name: "A4. Buku Aparat Pemerintah Desa",
        url: "/buku/aparat-pemerintah-desa",
        disabled: true,
      },
      {
        name: "A5. Buku Tanah Kas Desa",
        url: "/buku/tanah-kas",
      },
      {
        name: "A6. Buku Tanah Desa",
        url: "/buku/tanah",
      },
      {
        name: "A7. Buku Agenda Desa",
        url: "/buku/agenda",
      },
      {
        name: "A8. Buku Ekspedisi Desa",
        url: "/buku/ekspedisi",
      },
      {
        name: "A9. Buku Lembaran Desa",
        url: "/buku/lembaran",
      },
    ],
    navBukuAdministrasiPenduduk: [
      {
        name: "B1. Buku Induk Penduduk Desa",
        url: "/buku/induk-penduduk",
        disabled: true,
      },
      {
        name: "B2. Buku Mutasi Penduduk Desa",
        url: "/buku/mutasi-penduduk",
        disabled: true,
      },
      {
        name: "B3. Buku Rekapitulasi Jumlah Penduduk Desa",
        url: "/buku/rekapitulasi-penduduk",
        disabled: true,
      },
      {
        name: "B4. Buku Penduduk Sementara",
        url: "/buku/penduduk-sementara",
      },
      {
        name: "B5. Buku KTP dan Kartu Keluarga",
        url: "/buku/ktp-dan-kartu-keluarga",
        disabled: true,
      },
    ],
    navBukuAdministrasiKeuangan: [
      {
        name: "C1. Buku Anggaran Pendapatan dan Belanja Desa",
        url: "/buku/anggaran-pendapatan-dan-belanja-desa",
        disabled: true,
      },
      {
        name: "C2. Buku Rencana Anggaran Biaya Desa",
        url: "/buku/rencana-anggaran-biaya",
      },
      {
        name: "C3. Buku Kas Pembantu Kegiatan",
        url: "/buku/kas-pembantu-kegiatan",
        disabled: true,
      },
      {
        name: "C4. Buku Kas Umum",
        url: "/buku/kas-umum",
        disabled: true,
      },
      {
        name: "C5. Buku Kas Pembantu",
        url: "/buku/kas-pembantu",
        disabled: true,
      },
      {
        name: "C6. Buku Bank Desa",
        url: "/buku/bank-desa",
        disabled: true,
      },
    ],
    navBukuAdministrasiPembangunan: [
      {
        name: "D1. Buku Rencana Kerja Pembangunan Desa",
        url: "/buku/rencana-kerja-pembangunan",
      },
      {
        name: "D2. Buku Kegiatan Pembangunan Desa",
        url: "/buku/kegiatan-pembangunan",
      },
      {
        name: "D3. Buku Inventaris Hasil-hasil Pembangunan Desa",
        url: "/buku/inventaris",
      },
      {
        name: "D4. Buku Kader Pemberdayaan Masyarakat Desa",
        url: "/buku/kader-pemberdayaan-masyarakat",
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
