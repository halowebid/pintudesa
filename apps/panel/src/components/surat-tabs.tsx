import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"

import { SuratCardGrid } from "./surat-card-grid"

const internalSurat = [
  {
    label: "SPT",
    name: "Surat Perintah Tugas",
    href: "/internal/surat-perintah-tugas",
    disabled: true,
  },
  {
    label: "SU",
    name: "Surat Undangan",
    href: "/internal/surat-undangan",
    disabled: true,
  },
  {
    label: "SPPD",
    name: "Surat Perintah Perjalanan Dinas",
    href: "/internal/surat-perintah-perjalanan-dinas",
    disabled: true,
  },
]

const desaSurat = [
  {
    label: "SKM",
    name: "Surat Keterangan Kematian",
    href: "/surat/surat-keterangan-kematian",
    disabled: false,
  },
  {
    label: "SKL",
    name: "Surat Keterangan Kelahiran",
    href: "/surat/surat-keterangan-kelahiran",
    disabled: false,
  },
  {
    label: "SKGR",
    name: "Surat Kuasa SKGR",
    href: "/surat/surat-kuasa-skgr",
    disabled: false,
  },
  {
    label: "PBM",
    name: "Surat Pernyataan Belum Menikah",
    href: "/surat/surat-pernyataan-belum-menikah",
    disabled: false,
  },
  {
    label: "IK",
    name: "Surat Izin Keramaian",
    href: "/surat/surat-izin-keramaian",
    disabled: false,
  },
  {
    label: "SKCK",
    name: "Surat Pengantar SKCK",
    href: "/surat/surat-pengantar-skck",
    disabled: false,
  },
  {
    label: "SKAW",
    name: "Surat Keterangan Ahli Waris",
    href: "/surat/surat-keterangan-ahli-waris",
    disabled: true,
  },
  {
    label: "IMB",
    name: "Surat Izin Mendirikan Bangunan",
    href: "/surat/suzat-izin-mendirikan-bangunan",
    disabled: true,
  },
  {
    label: "SKD",
    name: "Surat Keterangan Domisili",
    href: "/surat/surat-keterangan-domisili",
    disabled: true,
  },
]

export function SuratTabs() {
  return (
    <Tabs defaultValue="desa" className="w-full px-4 py-2 lg:px-6">
      <TabsList>
        <TabsTrigger value="desa">
          <Icon name="Home" /> Desa
        </TabsTrigger>
        <TabsTrigger value="internal">
          <Icon name="Home" /> Internal
        </TabsTrigger>
      </TabsList>

      <TabsContent value="desa">
        <SuratCardGrid items={desaSurat} />
      </TabsContent>

      <TabsContent value="internal">
        <SuratCardGrid items={internalSurat} />
      </TabsContent>
    </Tabs>
  )
}
