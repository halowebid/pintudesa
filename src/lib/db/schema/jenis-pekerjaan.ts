import { pgEnum } from "drizzle-orm/pg-core"
import z from "zod"

export const JENIS_PEKERJAAN = [
  "wakil_wali_kota",
  "wali_kota",
  "tentara_nasional_indonesia",
  "sopir",
  "psikiater_psikolog",
  "pilot",
  "pialang",
  "perawat",
  "perangkat_desa",
  "penyiar_televisi",
  "penyiar_radio",
  "pengacara",
  "peneliti",
  "pelaut",
  "pedagang",
  "paranormal",
  "notaris",
  "lainnya",
  "konsultan",
  "kepala desa",
  "guru",
  "dosen",
  "dokter",
  "biarawati",
  "bidan",
  "arsitek",
  "apoteker",
  "anggota_dprd_provinsi",
  "anggota_dprd_kabupaten_kota",
  "akuntan",
  "wiraswasta",
  "wakil_bupati",
  "bupati",
  "wakil_gubernur",
  "gubernur",
  "duta_besar",
  "anggota_kabinet_kementerian",
  "anggota_mahkamah konstitusi",
  "wakil_presiden",
  "presiden",
  "anggota_bpk",
  "anggota_dpd",
  "anggota_dpr-ri",
  "promotor_acara",
  "juru_masak",
  "ustadz_mubaligh",
  "wartawan",
  "pastor",
  "pendeta",
  "imam_masjid",
  "penterjemah",
  "perancang_busana",
  "paraji",
  "tabib",
  "seniman",
  "mekanik",
  "penata_rambut",
  "penata_busana",
  "penata_rias",
  "tukang_gigi",
  "tukang_jahit",
  "tukang_las_pandai besi",
  "tukang_sol_sepatu",
  "tukang_kayu",
  "tukang_batu",
  "tukang_listrik",
  "tukang_cukur",
  "pembantu_rumah_tangga",
  "buruh_peternakan",
  "buruh_nelayan_perikanan",
  "buruh_tani_perkebunan",
  "buruh_harian_lepas",
  "karyawan_honorer",
  "karyawan_bumd",
  "karyawan_bumn",
  "karyawan_swasta",
  "transportasi",
  "konstruksi",
  "industri",
  "nelayan_perikanan",
  "peternak",
  "petani_pekebun",
  "perdagangan",
  "kepolisian_ri",
  "pegawai_negeri_sipil",
  "pensiunan",
  "pelajar_mahasiswa",
  "mengurus_rumah_tangga",
  "belum_tidak bekerja",
] as const

export type JenisPekerjaanType =
  | "Wakil Wali Kota"
  | "Wali Kota"
  | "Tentara Nasional Indonesia"
  | "Sopir"
  | "Psikiater/Psikolog"
  | "Pilot"
  | "Pialang"
  | "Perawat"
  | "Perangkat Desa"
  | "Penyiar Televisi"
  | "Penyiar Radio"
  | "Pengacara"
  | "Peneliti"
  | "Pelaut"
  | "Pedagang"
  | "Paranormal"
  | "Notaris"
  | "Lainnya"
  | "Konsultan"
  | "Kepala Desa"
  | "Guru"
  | "Dosen"
  | "Dokter"
  | "Biarawati"
  | "Bidan"
  | "Arsitek"
  | "Apoteker"
  | "Anggota DPRD Provinsi"
  | "Anggota DPRD Kabupaten/Kota"
  | "Akuntan"
  | "Wiraswasta"
  | "Wakil Bupati"
  | "Bupati"
  | "Wakil Gubernur"
  | "Gubernur"
  | "Duta Besar"
  | "Anggota Kabinet/Kementerian"
  | "Anggota Mahkamah Konstitusi"
  | "Wakil Presiden"
  | "Presiden"
  | "Anggota BPK"
  | "Anggota DPD"
  | "Anggota DPR-RI"
  | "Promotor Acara"
  | "Juru Masak"
  | "Ustadz/Mubaligh"
  | "Wartawan"
  | "Pastor"
  | "Pendeta"
  | "Imam Masjid"
  | "Penterjemah"
  | "Perancang Busana"
  | "Paraji"
  | "Tabib"
  | "Seniman"
  | "Mekanik"
  | "Penata Rambut"
  | "Penata Busana"
  | "Penata Rias"
  | "Tukang Gigi"
  | "Tukang Jahit"
  | "Tukang Las/Pandai Besi"
  | "Tukang Sol Sepatu"
  | "Tukang Kayu"
  | "Tukang Batu"
  | "Tukang Listrik"
  | "Tukang Cukur"
  | "Pembantu Rumah Tangga"
  | "Buruh Peternakan"
  | "Buruh Nelayan/Perikanan"
  | "Buruh Tani/Perkebunan"
  | "Buruh Harian Lepas"
  | "Karyawan Honorer"
  | "Karyawan BUMD"
  | "Karyawan BUMN"
  | "Karyawan Swasta"
  | "Transportasi"
  | "Konstruksi"
  | "Industri"
  | "Nelayan/Perikanan"
  | "Peternak"
  | "Petani/Pekebun"
  | "Perdagangan"
  | "Kepolisian RI"
  | "Pegawai Negeri Sipil"
  | "Pensiunan"
  | "Pelajar/Mahasiswa"
  | "Mengurus Rumah Tangga"
  | "Belum/Tidak Bekerja"

export const listJenisPekerjaan = [
  "Wakil Wali Kota",
  "Wali Kota",
  "Tentara Nasional Indonesia",
  "Sopir",
  "Psikiater/Psikolog",
  "Pilot",
  "Pialang",
  "Perawat",
  "Perangkat Desa",
  "Penyiar Televisi",
  "Penyiar Radio",
  "Pengacara",
  "Peneliti",
  "Pelaut",
  "Pedagang",
  "Paranormal",
  "Notaris",
  "Lainnya",
  "Konsultan",
  "Kepala Desa",
  "Guru",
  "Dosen",
  "Dokter",
  "Biarawati",
  "Bidan",
  "Arsitek",
  "Apoteker",
  "Anggota DPRD Provinsi",
  "Anggota DPRD Kabupaten/Kota",
  "Akuntan",
  "Wiraswasta",
  "Wakil Bupati",
  "Bupati",
  "Wakil Gubernur",
  "Gubernur",
  "Duta Besar",
  "Anggota Kabinet/Kementerian",
  "Anggota Mahkamah Konstitusi",
  "Wakil Presiden",
  "Presiden",
  "Anggota BPK",
  "Anggota DPD",
  "Anggota DPR-RI",
  "Promotor Acara",
  "Juru Masak",
  "Ustadz/Mubaligh",
  "Wartawan",
  "Pastor",
  "Pendeta",
  "Imam Masjid",
  "Penterjemah",
  "Perancang Busana",
  "Paraji",
  "Tabib",
  "Seniman",
  "Mekanik",
  "Penata Rambut",
  "Penata Busana",
  "Penata Rias",
  "Tukang Gigi",
  "Tukang Jahit",
  "Tukang Las/Pandai Besi",
  "Tukang Sol Sepatu",
  "Tukang Kayu",
  "Tukang Batu",
  "Tukang Listrik",
  "Tukang Cukur",
  "Pembantu Rumah Tangga",
  "Buruh Peternakan",
  "Buruh Nelayan/Perikanan",
  "Buruh Tani/Perkebunan",
  "Buruh Harian Lepas",
  "Karyawan Honorer",
  "Karyawan BUMD",
  "Karyawan BUMN",
  "Karyawan Swasta",
  "Transportasi",
  "Konstruksi",
  "Industri",
  "Nelayan/Perikanan",
  "Peternak",
  "Petani/Pekebun",
  "Perdagangan",
  "Kepolisian RI",
  "Pegawai Negeri Sipil",
  "Pensiunan",
  "Pelajar/Mahasiswa",
  "Mengurus Rumah Tangga",
  "Belum/Tidak Bekerja",
]

export const jenisPekerjaan = z.enum(JENIS_PEKERJAAN)

export const jenisPekerjaanEnum = pgEnum("jenis_pekerjaan", JENIS_PEKERJAAN)

export type JenisPekerjaan = z.infer<typeof jenisPekerjaan>
