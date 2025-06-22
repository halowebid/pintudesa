import { createCustomId } from "@pintudesa/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const rencanaKerjaPembangunanTable = pgTable(
  "rencana_kerja_pembangunan",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    namaKegiatan: text("nama_kegiatan").notNull(),
    lokasi: text("lokasi").notNull(),
    tahunPerencanaan: text("tahun_perencanaan").notNull(),
    jumlah: text("jumlah").notNull(),
    pelaksana: text("pelaksana").notNull(),
    manfaat: text("manfaat").notNull(),
    keterangan: text("keterangan").notNull(),
    biayaDariPemerintah: text("biaya_dari_pemerintah"),
    biayaDariProvinsi: text("biaya_dari_provinsi"),
    biayaDariKabupaten: text("biaya_dari_kabupaten"),
    biayaDariSwadaya: text("biaya_dari_swadaya"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const insertRencanaKerjaPembangunanSchema = createInsertSchema(
  rencanaKerjaPembangunanTable,
)
export const updateRencanaKerjaPembangunanSchema = createUpdateSchema(
  rencanaKerjaPembangunanTable,
)

export type SelectRencanaKerjaPembangunan =
  typeof rencanaKerjaPembangunanTable.$inferSelect
export type InsertRencanaKerjaPembangunan =
  typeof rencanaKerjaPembangunanTable.$inferInsert
