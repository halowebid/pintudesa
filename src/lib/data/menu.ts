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
  { name: "Ringkasan", url: "/dashboard", category: "Menu" },
  { name: "Pengaturan", url: "/dashboard/setting", category: "Menu" },
  { name: "Pengguna", url: "/dashboard/user", category: "Menu" },

  {
    name: "Kartu Keluarga",
    url: "/dashboard/kartu-keluarga",
    category: "Kependudukan",
  },
  { name: "Penduduk", url: "/dashboard/penduduk", category: "Kependudukan" },

  {
    name: "Buku Peraturan Desa",
    url: "/dashboard/buku/peraturan",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Keputusan Kepala Desa",
    url: "/dashboard/buku/keputusan-kepala-desa",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Inventaris Desa",
    url: "/dashboard/buku/inventaris",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Tanah Kas Desa",
    url: "/dashboard/buku/tanah-kas",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Tanah Desa",
    url: "/dashboard/buku/tanah",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Agenda Desa",
    url: "/dashboard/buku/agenda",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Ekspedisi Desa",
    url: "/dashboard/buku/ekspedisi",
    category: "Buku Administrasi Umum",
  },
  {
    name: "Buku Lembaran Desa",
    url: "/dashboard/buku/lembaran",
    category: "Buku Administrasi Umum",
  },

  {
    name: "Buku Penduduk Sementara",
    url: "/dashboard/buku/penduduk-sementara",
    category: "Buku Administrasi Penduduk",
  },

  {
    name: "Buku Rencana Anggaran Biaya Desa",
    url: "/dashboard/buku/rencana-anggaran-biaya",
    category: "Buku Administrasi Keuangan",
  },

  {
    name: "Buku Rencana Kerja Pembangunan Desa",
    url: "/dashboard/buku/rencana-kerja-pembangunan",
    category: "Buku Administrasi Pembangunan",
  },
  {
    name: "Buku Kegiatan Pembangunan Desa",
    url: "/dashboard/buku/kegiatan-pembangunan",
    category: "Buku Administrasi Pembangunan",
  },
  {
    name: "Buku Inventaris Hasil-hasil Pembangunan Desa",
    url: "/dashboard/buku/inventaris-hasil-pembangunan",
    category: "Buku Administrasi Pembangunan",
  },
  {
    name: "Buku Kader Pemberdayaan Masyarakat Desa",
    url: "/dashboard/buku/kader-pemberdayaan-masyarakat",
    category: "Buku Administrasi Pembangunan",
  },

  {
    name: "Surat Izin Keramaian",
    url: "/dashboard/surat/surat-izin-keramaian",
    category: "Surat",
  },
  {
    name: "Surat Izin Mendirikan Bangunan",
    url: "/dashboard/surat/surat-izin-mendirikan-bangunan",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Domisili",
    url: "/dashboard/surat/surat-keterangan-domisili",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Gaib",
    url: "/dashboard/surat/surat-keterangan-gaib",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Jalan",
    url: "/dashboard/surat/surat-keterangan-jalan",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Kelahiran",
    url: "/dashboard/surat/surat-keterangan-kelahiran",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Kematian",
    url: "/dashboard/surat/surat-keterangan-kematian",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Belum Memiliki Rumah",
    url: "/dashboard/surat/surat-keterangan-belum-memiliki-rumah",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Kepemilikan Rumah",
    url: "/dashboard/surat/surat-keterangan-kepemilikan-rumah",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Penghasilan",
    url: "/dashboard/surat/surat-keterangan-penghasilan",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Penghasilan Orang Tua",
    url: "/dashboard/surat/surat-keterangan-penghasilan-orang-tua",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Penyaksian Tanah",
    url: "/dashboard/surat/surat-keterangan-penyaksian-tanah",
    category: "Surat",
  },
  {
    name: "Surat Keterangan Ahli Waris",
    url: "/dashboard/surat/surat-keterangan-ahli-waris",
    category: "Surat",
  },
  {
    name: "Surat Kuasa SKGR",
    url: "/dashboard/surat/surat-kuasa-skgr",
    category: "Surat",
  },
  {
    name: "Surat Pengantar SKCK",
    url: "/dashboard/surat/surat-pengantar-skck",
    category: "Surat",
  },
  {
    name: "Surat Pernyataan Belum Menikah",
    url: "/dashboard/surat/surat-pernyataan-belum-menikah",
    category: "Surat",
  },
  {
    name: "Surat Pindah Desa BPN",
    url: "/dashboard/surat/surat-pindah-desa-bpn",
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
