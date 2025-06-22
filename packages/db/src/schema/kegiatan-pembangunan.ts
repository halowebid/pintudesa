import { createCustomId } from "@pintudesa/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const kegiatanPembangunanTable = pgTable("kegiatan_pembangunan", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  namaKegiatan: text("nama_kegiatan").notNull(),
  tahunKegiatan: text("tahun_kegiatan").notNull(),
  volume: text("volume"),
  jumlah: text("jumlah").notNull(),
  waktuPengerjaan: text("waktu_pengerjaan").notNull(),
  pelaksana: text("pelaksana").notNull(),
  baru: text("baru"),
  lanjutan: text("lanjutan"),
  keteranganTambahan: text("keterangan_tambahan"),
  biayaDariPemerintah: text("biaya_dari_pemerintah").notNull(),
  biayaDariProvinsi: text("biaya_dari_provinsi"),
  biayaDariKabupaten: text("biaya_dari_kabupaten"),
  biayaDariSwadaya: text("biaya_dari_swadaya"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertKegiatanPembangunanSchema = createInsertSchema(
  kegiatanPembangunanTable,
)
export const updateKegiatanPembangunanSchema = createUpdateSchema(
  kegiatanPembangunanTable,
)

export type SelectKegiatanPembangunan =
  typeof kegiatanPembangunanTable.$inferSelect
export type InsertKegiatanPembangunan =
  typeof kegiatanPembangunanTable.$inferInsert
