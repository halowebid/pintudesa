import {
  JENIS_INVENTARIS,
  JENIS_KELAMIN,
  JENIS_PERATURAN,
  JENIS_SURAT_AGENDA,
  type SelectAgenda,
  type SelectInventaris,
  type SelectKaderPemberdayaanMasyarakat,
  type SelectLembaran,
  type SelectPeraturan,
} from "@pintudesa/db"
import { formatDate } from "@pintudesa/utils"

import { createLabelMap } from "./label"

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
