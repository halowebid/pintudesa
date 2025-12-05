import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

/**
 * Database table for Business Domicile Certificate (Surat Keterangan Domisili Usaha)
 *
 * This table stores certificates that verify the location of a business establishment
 * operated by a village resident. Required for business licensing and administrative purposes.
 */
export const suratKeteranganDomisiliUsahaTable = pgTable(
  "surat_keterangan_domisili_usaha",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, {
        onDelete: "cascade",
      }),
    jenisUsaha: text("jenis_usaha").notNull(),
    namaTempatUsaha: text("nama_tempat_usaha").notNull(),
    lokasiUsaha: text("lokasi_usaha").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganDomisiliUsahaRelations = relations(
  suratKeteranganDomisiliUsahaTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganDomisiliUsahaTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganDomisiliUsahaSchema = createInsertSchema(
  suratKeteranganDomisiliUsahaTable,
)
export const updateSuratKeteranganDomisiliUsahaSchema = createUpdateSchema(
  suratKeteranganDomisiliUsahaTable,
)

export type SelectSuratKeteranganDomisiliUsaha =
  typeof suratKeteranganDomisiliUsahaTable.$inferSelect
export type InsertSuratKeteranganDomisiliUsaha =
  typeof suratKeteranganDomisiliUsahaTable.$inferInsert
