/**
 * Menu items data structure for search and navigation
 */

export interface MenuItem {
  name: string
  url: string
  category: string
  disabled?: boolean
}

export const menuItems: MenuItem[] = [
  { name: "Ringkasan", url: "/", category: "Menu" },
  { name: "Pengaturan", url: "/setting", category: "Menu" },
  { name: "Pengguna", url: "/user", category: "Menu" },

  { name: "Kartu Keluarga", url: "/kartu-keluarga", category: "Kependudukan" },
  { name: "Penduduk", url: "/penduduk", category: "Kependudukan" },

  {
    name: "Buku Peraturan Desa",
    url: "/buku/peraturan",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Keputusan Kepala Desa",
    url: "/buku/keputusan-kepala-desa",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Inventaris Desa",
    url: "/buku/inventaris",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Tanah Kas Desa",
    url: "/buku/tanah-kas",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Tanah Desa",
    url: "/buku/tanah",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Agenda Desa",
    url: "/buku/agenda",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Ekspedisi Desa",
    url: "/buku/ekspedisi",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Lembaran Desa",
    url: "/buku/lembaran",
    category: "Buku Administrasi Umum",
  },

  {
    name: "Buku Penduduk Sementara",
    url: "/buku/penduduk-sementara",
    category: "Buku Administrasi Penduduk",
  },

  {
    name: "Buku Rencana Anggaran Biaya Desa",
    url: "/buku/rencana-anggaran-biaya",
    category: "Buku Administrasi Keuangan",
  },

  {
    name: "Buku Rencana Kerja Pembangunan Desa",
    url: "/buku/rencana-kerja-pembangunan",
    category: "Buku Administrasi Pembangunan",
  },
  {
    name: "Buku Kegiatan Pembangunan Desa",
    url: "/buku/kegiatan-pembangunan",
    category: "Buku Administrasi Pembangunan",
  },
  {
    name: "Buku Inventaris Hasil-hasil Pembangunan Desa",
    url: "/buku/inventaris-hasil-pembangunan",
    category: "Buku Administrasi Pembangunan",
  },
  {
    name: "Buku Kader Pemberdayaan Masyarakat Desa",
    url: "/buku/kader-pemberdayaan-masyarakat",
    category: "Buku Administrasi Pembangunan",
  },

  {
    name: "Surat Izin Keramaian",
    url: "/surat/surat-izin-keramaian",
    category: "Surat",
  },
  {
    name: "Surat Izin Mendirikan Bangunan",
    url: "/surat/surat-izin-mendirikan-bangunan",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Domisili",
    url: "/surat/surat-keterangan-domisili",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Gaib",
    url: "/surat/surat-keterangan-gaib",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Jalan",
    url: "/surat/surat-keterangan-jalan",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Kelahiran",
    url: "/surat/surat-keterangan-kelahiran",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Kematian",
    url: "/surat/surat-keterangan-kematian",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Kepemilikan Rumah",
    url: "/surat/surat-keterangan-kepemilikan-rumah",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Penghasilan",
    url: "/surat/surat-keterangan-penghasilan",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Penghasilan Orang Tua",
    url: "/surat/surat-keterangan-penghasilan-orang-tua",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Penyaksian Tanah",
    url: "/surat/surat-keterangan-penyaksian-tanah",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Ahli Waris",
    url: "/surat/surat-keterangan-ahli-waris",
    category: "Surat",
  },
  {
    name: "Surat Kuasa SKGR",
    url: "/surat/surat-kuasa-skgr",
    category: "Surat",
  },
  {
    name: "Surat Pengantar SKCK",
    url: "/surat/surat-pengantar-skck",
    category: "Surat",
  },
  {
    name: "Surat Pernyataan Belum Menikah",
    url: "/surat/surat-pernyataan-belum-menikah",
    category: "Surat",
  },
]

/**
 * Search menu items by query
 */
export function searchMenuItems(query: string): MenuItem[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return menuItems.filter(
    (item) =>
      !item.disabled &&
      (item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)),
  )
}
