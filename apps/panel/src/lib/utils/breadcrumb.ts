/**
 * Route segment to display label mapping for breadcrumbs
 * Maps Indonesian route segments to human-readable display names
 */
export const routeLabels: Record<string, string> = {
  // Main sections
  buku: "Buku",
  surat: "Surat",
  setting: "Pengaturan",
  user: "Pengguna",
  penduduk: "Penduduk",
  "kartu-keluarga": "Kartu Keluarga",

  // Buku Administrasi Umum
  "peraturan-desa": "Peraturan Desa",
  "keputusan-kepala-desa": "Keputusan Kepala Desa",
  "buku-a3": "Inventaris Desa",
  "aparat-pemerintah-desa": "Aparat Pemerintah Desa",
  "tanah-kas": "Tanah Kas Desa",
  tanah: "Tanah Desa",
  agenda: "Agenda Desa",
  ekspedisi: "Ekspedisi Desa",
  lembaran: "Lembaran Desa",
  peraturan: "Peraturan",

  // Buku Administrasi Penduduk
  "induk-penduduk": "Induk Penduduk Desa",
  "mutasi-penduduk": "Mutasi Penduduk Desa",
  "rekapitulasi-penduduk": "Rekapitulasi Jumlah Penduduk Desa",
  "penduduk-sementara": "Penduduk Sementara",
  "ktp-dan-kartu-keluarga": "KTP dan Kartu Keluarga",

  // Buku Administrasi Keuangan
  "anggaran-pendapatan-dan-belanja-desa":
    "Anggaran Pendapatan dan Belanja Desa",
  "rencana-anggaran-biaya": "Rencana Anggaran Biaya Desa",
  "kas-pembantu-kegiatan": "Kas Pembantu Kegiatan",
  "kas-umum": "Kas Umum",
  "kas-pembantu": "Kas Pembantu",
  "bank-desa": "Bank Desa",

  // Buku Administrasi Pembangunan
  "rencana-kerja-pembangunan": "Rencana Kerja Pembangunan Desa",
  "kegiatan-pembangunan": "Kegiatan Pembangunan Desa",
  inventaris: "Inventaris Hasil-hasil Pembangunan Desa",
  "kader-pemberdayaan-masyarakat": "Kader Pemberdayaan Masyarakat Desa",

  // Actions
  tambah: "Tambah",
  edit: "Edit",
  detail: "Detail",
}

/**
 * Generates breadcrumb items from a pathname
 * @param pathname - The current pathname from usePathname()
 * @returns Array of breadcrumb items with label and href
 */
export function generateBreadcrumbs(pathname: string): {
  label: string
  href: string
}[] {
  // Remove leading slash and split into segments
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return [{ label: "Ringkasan", href: "/" }]
  }

  const breadcrumbs: { label: string; href: string }[] = [
    { label: "Ringkasan", href: "/" },
  ]

  let currentPath = ""
  for (const segment of segments) {
    currentPath += `/${segment}`

    // Check if segment is a dynamic ID (UUID or number)
    const isDynamicId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment,
      ) || /^\d+$/.test(segment)

    if (isDynamicId) {
      // Skip dynamic IDs in breadcrumbs
      continue
    }

    // Get label from mapping or use segment as-is with capitalization
    const label =
      routeLabels[segment] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    breadcrumbs.push({
      label,
      href: currentPath,
    })
  }

  return breadcrumbs
}
