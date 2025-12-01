import type { SuratType } from "@pintudesa/db/schema"

export interface VariableDefinition {
  name: string
  label: string
  description: string
  category: "desa" | "pemohon" | "surat"
}

export const COMMON_VARIABLES: VariableDefinition[] = [
  {
    name: "namaDesa",
    label: "Nama Desa",
    description: "Nama desa",
    category: "desa",
  },
  {
    name: "kecamatan",
    label: "Kecamatan",
    description: "Nama kecamatan",
    category: "desa",
  },
  {
    name: "kabupaten",
    label: "Kabupaten",
    description: "Nama kabupaten/kota",
    category: "desa",
  },
  {
    name: "provinsi",
    label: "Provinsi",
    description: "Nama provinsi",
    category: "desa",
  },
  {
    name: "tanggalSurat",
    label: "Tanggal Surat",
    description: "Tanggal surat dibuat (format: 18 November 2025)",
    category: "desa",
  },
  {
    name: "tahunSurat",
    label: "Tahun Surat",
    description: "Tahun surat dibuat",
    category: "desa",
  },
  {
    name: "namaKepala",
    label: "Nama Kepala Desa",
    description: "Nama kepala desa",
    category: "desa",
  },
  {
    name: "nipKepala",
    label: "NIP Kepala Desa",
    description: "NIP kepala desa",
    category: "desa",
  },
]

export const PEMOHON_VARIABLES: VariableDefinition[] = [
  {
    name: "pemohon.nik",
    label: "NIK Pemohon",
    description: "NIK pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.namaLengkap",
    label: "Nama Lengkap Pemohon",
    description: "Nama lengkap pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.tempatLahir",
    label: "Tempat Lahir Pemohon",
    description: "Tempat lahir pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.tanggalLahir",
    label: "Tanggal Lahir Pemohon",
    description: "Tanggal lahir pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.jenisKelamin",
    label: "Jenis Kelamin Pemohon",
    description: "Jenis kelamin pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.agama",
    label: "Agama Pemohon",
    description: "Agama pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.statusPerkawinan",
    label: "Status Perkawinan Pemohon",
    description: "Status perkawinan pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.pekerjaan",
    label: "Pekerjaan Pemohon",
    description: "Pekerjaan pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.pendidikanTerakhir",
    label: "Pendidikan Terakhir Pemohon",
    description: "Pendidikan terakhir pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.alamat",
    label: "Alamat Pemohon",
    description: "Alamat lengkap pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.rt",
    label: "RT Pemohon",
    description: "RT pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.rw",
    label: "RW Pemohon",
    description: "RW pemohon",
    category: "pemohon",
  },
  {
    name: "pemohon.dusun",
    label: "Dusun Pemohon",
    description: "Dusun pemohon",
    category: "pemohon",
  },
]

export const SURAT_TYPE_VARIABLES: Record<SuratType, VariableDefinition[]> = {
  "surat-keterangan-domisili": [
    {
      name: "jumlahTahunDomisili",
      label: "Jumlah Tahun Domisili",
      description: "Jumlah tahun berdomisili",
      category: "surat",
    },
    {
      name: "jumlahKeluarga",
      label: "Jumlah Anggota Keluarga",
      description: "Jumlah anggota keluarga",
      category: "surat",
    },
  ],
  "surat-keterangan-gaib": [
    {
      name: "pasangan.namaLengkap",
      label: "Nama Pasangan",
      description: "Nama lengkap pasangan yang gaib",
      category: "surat",
    },
    {
      name: "pasangan.nik",
      label: "NIK Pasangan",
      description: "NIK pasangan yang gaib",
      category: "surat",
    },
    {
      name: "tanggalDitinggal",
      label: "Tanggal Ditinggal",
      description: "Tanggal ditinggalkan",
      category: "surat",
    },
  ],
  "surat-keterangan-kelahiran": [
    {
      name: "ayah.namaLengkap",
      label: "Nama Ayah",
      description: "Nama lengkap ayah",
      category: "surat",
    },
    {
      name: "ayah.nik",
      label: "NIK Ayah",
      description: "NIK ayah",
      category: "surat",
    },
    {
      name: "ibu.namaLengkap",
      label: "Nama Ibu",
      description: "Nama lengkap ibu",
      category: "surat",
    },
    {
      name: "ibu.nik",
      label: "NIK Ibu",
      description: "NIK ibu",
      category: "surat",
    },
    {
      name: "bayi.namaLengkap",
      label: "Nama Bayi",
      description: "Nama lengkap bayi",
      category: "surat",
    },
    {
      name: "jenisKelahiran",
      label: "Jenis Kelahiran",
      description: "Jenis kelahiran (tunggal/kembar)",
      category: "surat",
    },
    {
      name: "anakKe",
      label: "Anak Ke-",
      description: "Anak ke berapa",
      category: "surat",
    },
    {
      name: "penolongKelahiran",
      label: "Penolong Kelahiran",
      description: "Penolong kelahiran",
      category: "surat",
    },
    {
      name: "beratBayi",
      label: "Berat Bayi",
      description: "Berat bayi (gram)",
      category: "surat",
    },
    {
      name: "panjangBayi",
      label: "Panjang Bayi",
      description: "Panjang bayi (cm)",
      category: "surat",
    },
  ],
  "surat-keterangan-kematian": [
    {
      name: "yangMeninggal.namaLengkap",
      label: "Nama yang Meninggal",
      description: "Nama lengkap yang meninggal",
      category: "surat",
    },
    {
      name: "yangMeninggal.nik",
      label: "NIK yang Meninggal",
      description: "NIK yang meninggal",
      category: "surat",
    },
    {
      name: "tanggalMeninggal",
      label: "Tanggal Meninggal",
      description: "Tanggal meninggal",
      category: "surat",
    },
    {
      name: "jamMeninggal",
      label: "Jam Meninggal",
      description: "Jam meninggal (HH:MM)",
      category: "surat",
    },
    {
      name: "tempatMeninggal",
      label: "Tempat Meninggal",
      description: "Tempat meninggal",
      category: "surat",
    },
    {
      name: "penyebabKematian",
      label: "Penyebab Kematian",
      description: "Penyebab kematian",
      category: "surat",
    },
  ],
  "surat-izin-keramaian": [],
  "surat-izin-mendirikan-bangunan": [],
  "surat-keterangan-jalan": [],
  "surat-keterangan-kepemilikan-rumah": [],
  "surat-keterangan-penghasilan": [],
  "surat-keterangan-penghasilan-orang-tua": [],
  "surat-keterangan-penyaksian-tanah": [],
  "surat-kuasa-ahli-waris": [],
  "surat-kuasa-skgr": [],
  "surat-pengantar-skck": [],
  "surat-pernyataan-belum-menikah": [],
  "surat-pindah-desa-bpn": [
    {
      name: "nomorShm",
      label: "Nomor SHM",
      description: "Nomor Sertifikat Hak Milik",
      category: "surat",
    },
    {
      name: "tanggalShm",
      label: "Tanggal SHM",
      description: "Tanggal Sertifikat Hak Milik",
      category: "surat",
    },
    {
      name: "keteranganSurat",
      label: "Keterangan Surat",
      description: "Keterangan tambahan (opsional)",
      category: "surat",
    },
  ],
}

export function getVariablesForSuratType(
  suratType: SuratType,
): VariableDefinition[] {
  return [
    ...COMMON_VARIABLES,
    ...PEMOHON_VARIABLES,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ...(SURAT_TYPE_VARIABLES[suratType] || []),
  ]
}

export function searchVariables(
  variables: VariableDefinition[],
  query: string,
): VariableDefinition[] {
  const lowerQuery = query.toLowerCase()
  return variables.filter(
    (v) =>
      v.name.toLowerCase().includes(lowerQuery) ||
      v.label.toLowerCase().includes(lowerQuery) ||
      v.description.toLowerCase().includes(lowerQuery),
  )
}
