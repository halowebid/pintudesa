import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

/**
 * Table for village relocation certificates (Surat Pindah Desa BPN)
 * Documents residents relocating with land ownership information
 */
export const suratPindahDesaBpnTable = pgTable("surat_pindah_desa_bpn", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  nomorShm: text("nomor_shm").notNull(),
  tanggalShm: timestamp("tanggal_shm", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  keteranganSurat: text("keterangan_surat"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

/**
 * Relations for village relocation certificate table
 */
export const suratPindahDesaBpnRelations = relations(
  suratPindahDesaBpnTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratPindahDesaBpnTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

/**
 * Schema for inserting a new village relocation certificate
 */
export const insertSuratPindahDesaBpnSchema = createInsertSchema(
  suratPindahDesaBpnTable,
)

/**
 * Schema for updating an existing village relocation certificate
 */
export const updateSuratPindahDesaBpnSchema = createUpdateSchema(
  suratPindahDesaBpnTable,
)

/**
 * Type for selected village relocation certificate
 */
export type SelectSuratPindahDesaBpn =
  typeof suratPindahDesaBpnTable.$inferSelect

/**
 * Type for inserting a village relocation certificate
 */
export type InsertSuratPindahDesaBpn =
  typeof suratPindahDesaBpnTable.$inferInsert
