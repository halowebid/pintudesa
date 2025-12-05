import {
  AGAMA,
  ASAL_PENDUDUK,
  JENIS_INVENTARIS,
  JENIS_KELAMIN,
  JENIS_PEKERJAAN,
  JENIS_PERATURAN,
  JENIS_SURAT_AGENDA,
  PENDIDIKAN_TERAKHIR,
  STATUS_DOMISILI,
  STATUS_PENDUDUK,
  STATUS_PERKAWINAN,
  type SelectAgenda,
  type SelectInventaris,
  type SelectKaderPemberdayaanMasyarakat,
  type SelectLembaran,
  type SelectPenduduk,
  type SelectPendudukSementara,
  type SelectPeraturan,
} from "@/lib/db/schema"
import { formatDate } from "@/lib/utils"
import { createLabelMap } from "./label"

export const agamaLabelMap = createLabelMap(AGAMA)
export const asalPendudukLabelMap = createLabelMap(ASAL_PENDUDUK)
export const pendidikanTerakhirLabelMap = createLabelMap(PENDIDIKAN_TERAKHIR)
export const statusDomisiliLabelMap = createLabelMap(STATUS_DOMISILI)
export const statusPendudukLabelMap = createLabelMap(STATUS_PENDUDUK)
export const statusPerkawinanLabelMap = createLabelMap(STATUS_PERKAWINAN)
export const jenisPekerjaanLabelMap = createLabelMap(JENIS_PEKERJAAN)

export const jenisSuratAgendaLabelMap = createLabelMap(JENIS_SURAT_AGENDA)
export const jenisPeraturanLabelMap = createLabelMap(JENIS_PERATURAN)
export const jenisInventarisLabelMap = createLabelMap(JENIS_INVENTARIS)
export const jenisKelaminLabelMap = createLabelMap(JENIS_KELAMIN)

export const mapAgendaRow = (data: SelectAgenda[]) =>
  data.map((item) => ({
    ...item,
    jenisSurat: item.jenisSurat
      ? jenisSuratAgendaLabelMap[item.jenisSurat]
      : "-",
    createdAt: formatDate(item.createdAt, "LL"),
    updatedAt: formatDate(item.updatedAt, "LL"),
  }))

export function mapInventarisRow(data: SelectInventaris[]) {
  return data.map((item) => ({
    ...item,
    jenisInventaris: jenisInventarisLabelMap[item.jenisInventaris],
    tanggalPenghapusan: formatDate(item.tanggalPenghapusan, "LL"),
    createdAt: formatDate(item.createdAt, "LL"),
    updatedAt: formatDate(item.updatedAt, "LL"),
    keteranganTambahan: item.keteranganTambahan,
  }))
}

export const mapLembaranRow = (data: SelectLembaran[]) =>
  data.map((item) => ({
    ...item,
    jenisPeraturan: item.jenisPeraturan
      ? jenisPeraturanLabelMap[item.jenisPeraturan]
      : "-",
    createdAt: formatDate(item.createdAt, "LL"),
    updatedAt: formatDate(item.updatedAt, "LL"),
  }))

export const mapPeraturanRow = (data: SelectPeraturan[]) =>
  data.map((item) => ({
    ...item,
    jenisPeraturan: jenisPeraturanLabelMap[item.jenisPeraturan],
  }))

export const mapKaderPemberdayaanMasyarakatRow = (
  data: SelectKaderPemberdayaanMasyarakat[],
) =>
  data.map((item) => ({
    ...item,
    jenisKelamin: jenisKelaminLabelMap[item.jenisKelamin],
  }))

export function mapPendudukRow(data: SelectPenduduk[]) {
  return data.map((item) => ({
    ...item,
    agama: agamaLabelMap[item.agama],
    asalPenduduk:
      item.asalPenduduk != null ? asalPendudukLabelMap[item.asalPenduduk] : "-",
    pendidikanTerakhir: pendidikanTerakhirLabelMap[item.pendidikanTerakhir],
    statusDomisili: statusDomisiliLabelMap[item.statusDomisili],
    statusPenduduk:
      item.statusPenduduk != null
        ? statusPendudukLabelMap[item.statusPenduduk]
        : "-",
    statusPerkawinan: statusPerkawinanLabelMap[item.statusPerkawinan],
    jenisKelamin: jenisKelaminLabelMap[item.jenisKelamin],
    pekerjaan: jenisPekerjaanLabelMap[item.pekerjaan],
    tanggalLahir: formatDate(item.tanggalLahir, "LL"),
    createdAt: item.createdAt ? formatDate(item.createdAt, "LL") : "-",
    updatedAt: item.updatedAt ? formatDate(item.updatedAt, "LL") : "-",
  }))
}

export function mapPendudukSementaraRow(data: SelectPendudukSementara[]) {
  return data.map((item) => ({
    ...item,
    jenisKelamin: jenisKelaminLabelMap[item.jenisKelamin],
    pekerjaan: jenisPekerjaanLabelMap[item.pekerjaan],
    tanggalLahir: formatDate(item.tanggalLahir, "LL"),
    createdAt: item.createdAt ? formatDate(item.createdAt, "LL") : "-",
    updatedAt: item.updatedAt ? formatDate(item.updatedAt, "LL") : "-",
  }))
}
