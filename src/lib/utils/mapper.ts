import { JENIS_SURAT_AGENDA, type SelectAgenda } from "@/lib/db/schema/agenda"
import {
  JENIS_INVENTARIS,
  type SelectInventaris,
} from "@/lib/db/schema/inventaris"
import { JENIS_KELAMIN } from "@/lib/db/schema/jenis-kelamin"
import type { SelectLembaran } from "@/lib/db/schema/lembaran"
import { JENIS_PERATURAN } from "@/lib/db/schema/peraturan"
import type { SelectKaderPemberdayaanMasyarakat } from "../db/schema/kader-pemberdayaan-masyarakat"
import { formatDate } from "./date"
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
export const mapKaderPemberdayaanMasyarakatRow = (
  data: SelectKaderPemberdayaanMasyarakat[],
) =>
  data.map((item) => ({
    ...item,
    jenisKelamin: jenisKelaminLabelMap[item.jenisKelamin],
  }))
