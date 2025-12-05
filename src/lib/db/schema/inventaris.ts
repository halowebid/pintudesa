import { createCustomId } from "@/lib/utils"
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import z from "zod"

export const JENIS_INVENTARIS = ["barang", "bangunan"] as const

export const jenisInventaris = z.enum(JENIS_INVENTARIS)

export const jenisInventarisEnum = pgEnum("jenis_inventaris", JENIS_INVENTARIS)

export const inventarisTable = pgTable("inventaris", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  jenisInventaris: jenisInventarisEnum("jenis_inventaris")
    .notNull()
    .default("barang"),
  tahun: integer("tahun").notNull(),
  dariPemerintah: integer("dari_pemerintah"),
  dariProvinsi: integer("dari_provinsi"),
  dariKabupatenAtauKota: integer("dari_kabupaten_atau_kota"),
  diBeliSendiri: integer("dibeli_sendiri"),
  sumbangan: integer("sumbangan"),
  keadaanBaik: integer("keadaan_baik"),
  keadaanRusak: integer("keadaan_rusak"),
  penghapusanRusak: integer("penghapusan_rusak"),
  penghapusanDijual: integer("penghapusan_dijual"),
  penghapusanHilang: integer("penghapusan_hilang"),
  penghapusanDisumbangkan: integer("penghapusan_disumbangkan"),
  tanggalPenghapusan: timestamp("tanggal_penghapusan", {
    withTimezone: true,
    mode: "date",
  }),
  keadaanBaikAkhirTahun: integer("keadaan_baik_akhir_tahun"),
  keadaanRusakAkhirTahun: integer("keadaan_rusak_akhir_tahun"),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertInventarisSchema = createInsertSchema(inventarisTable)
export const updateInventarisSchema = createUpdateSchema(inventarisTable)

export type SelectInventaris = typeof inventarisTable.$inferSelect
export type InsertInventaris = typeof inventarisTable.$inferInsert

export type JenisInventaris = z.infer<typeof jenisInventaris>
