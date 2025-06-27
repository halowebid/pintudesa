import { Tabs, TabsContent, TabsList, TabsTrigger } from "@pintudesa/ui"
import { Icon } from "@yopem-ui/react-icons"

import { SuratCardGrid } from "./surat-card-grid"

const internalSurat = [
  {
    label: "SPT",
    name: "Surat Perintah Tugas",
    href: "/internal/spt",
    disabled: true,
  },
  { label: "SU", name: "Surat Undangan", href: "/internal/su", disabled: true },
  {
    label: "SPPD",
    name: "Surat Perintah Perjalanan Dinas",
    href: "/internal/sppd",
    disabled: true,
  },
]

const desaSurat = [
  {
    label: "SKM",
    name: "Surat Keterangan Kematian",
    href: "/desa/skm",
    disabled: true,
  },
  {
    label: "SKL",
    name: "Surat Keterangan Kelahiran",
    href: "/desa/skl",
    disabled: true,
  },
  {
    label: "SKGR",
    name: "Surat Kuasa SKGR",
    href: "/desa/skgr",
    disabled: true,
  },
  {
    label: "PBM",
    name: "Surat Pernyataan Belum Menikah",
    href: "/desa/pbm",
    disabled: true,
  },
  {
    label: "IK",
    name: "Surat Izin Keramaian",
    href: "/desa/ik",
    disabled: true,
  },
  {
    label: "SKCK",
    name: "Surat Pengantar SKCK",
    href: "/desa/skck",
    disabled: true,
  },
  {
    label: "SKAW",
    name: "Surat Keterangan Ahli Waris",
    href: "/desa/skaw",
    disabled: true,
  },
  {
    label: "IMB",
    name: "Surat Izin Mendirikan Bangunan",
    href: "/desa/imb",
    disabled: true,
  },
  {
    label: "SKD",
    name: "Surat Keterangan Domisili",
    href: "/desa/skd",
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
