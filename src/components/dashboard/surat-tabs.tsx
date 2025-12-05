import { Icon } from "@yopem-ui/react-icons"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui"
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
    label: "IK",
    name: "Surat Izin Keramaian",
    href: "/surat/surat-izin-keramaian",
    disabled: false,
  },
  {
    label: "IMB",
    name: "Surat Izin Mendirikan Bangunan",
    href: "/surat/surat-izin-mendirikan-bangunan",
    disabled: false,
  },
  {
    label: "SKD",
    name: "Surat Keterangan Domisili",
    href: "/surat/surat-keterangan-domisili",
    disabled: false,
  },
  {
    label: "SKDU",
    name: "Surat Keterangan Domisili Usaha",
    href: "/surat/surat-keterangan-domisili-usaha",
    disabled: false,
  },
  {
    label: "SKG",
    name: "Surat Keterangan Gaib",
    href: "/surat/surat-keterangan-gaib",
    disabled: false,
  },
  {
    label: "SKJ",
    name: "Surat Keterangan Jalan",
    href: "/surat/surat-keterangan-jalan",
    disabled: false,
  },
  {
    label: "SKL",
    name: "Surat Keterangan Kelahiran",
    href: "/surat/surat-keterangan-kelahiran",
    disabled: false,
  },
  {
    label: "SKM",
    name: "Surat Keterangan Kematian",
    href: "/surat/surat-keterangan-kematian",
    disabled: false,
  },
  {
    label: "BMR",
    name: "Surat Keterangan Belum Memiliki Rumah",
    href: "/surat/surat-keterangan-belum-memiliki-rumah",
    disabled: false,
  },
  {
    label: "SKKR",
    name: "Surat Keterangan Kepemilikan Rumah",
    href: "/surat/surat-keterangan-kepemilikan-rumah",
    disabled: false,
  },
  {
    label: "SKP",
    name: "Surat Keterangan Penghasilan",
    href: "/surat/surat-keterangan-penghasilan",
    disabled: false,
  },
  {
    label: "SKPOT",
    name: "Surat Keterangan Penghasilan Orang Tua",
    href: "/surat/surat-keterangan-penghasilan-orang-tua",
    disabled: false,
  },
  {
    label: "SKPT",
    name: "Surat Keterangan Penyaksian Tanah",
    href: "/surat/surat-keterangan-penyaksian-tanah",
    disabled: false,
  },
  {
    label: "SKU",
    name: "Surat Keterangan Usaha",
    href: "/surat/surat-keterangan-usaha",
    disabled: false,
  },
  {
    label: "SKBN",
    name: "Surat Keterangan Beda Nama",
    href: "/surat/surat-keterangan-beda-nama",
    disabled: false,
  },
  {
    label: "SKAW",
    name: "Surat Keterangan Ahli Waris",
    href: "/surat/surat-keterangan-ahli-waris",
    disabled: false,
  },
  {
    label: "SKGR",
    name: "Surat Kuasa SKGR",
    href: "/surat/surat-kuasa-skgr",
    disabled: false,
  },
  {
    label: "SKCK",
    name: "Surat Pengantar SKCK",
    href: "/surat/surat-pengantar-skck",
    disabled: false,
  },
  {
    label: "PBM",
    name: "Surat Pernyataan Belum Menikah",
    href: "/surat/surat-pernyataan-belum-menikah",
    disabled: false,
  },
  {
    label: "PBPN",
    name: "Surat Pindah Desa BPN",
    href: "/surat/surat-pindah-desa-bpn",
    disabled: false,
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
