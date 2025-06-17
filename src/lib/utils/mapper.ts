import { JENIS_SURAT_AGENDA, type SelectAgenda } from "@/lib/db/schema/agenda"
import {
  JENIS_INVENTARIS,
  type SelectInventaris,
} from "@/lib/db/schema/inventaris"
import { formatDate } from "./date"
import { createLabelMap } from "./label"

const jenisSuratAgendaLabelMap = createLabelMap(JENIS_SURAT_AGENDA)
export const jenisInventarisLabelMap = createLabelMap(JENIS_INVENTARIS)

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
