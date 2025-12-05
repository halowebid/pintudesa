import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganDomisiliTable = pgTable(
  "surat_keterangan_domisili",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    jumlahTahunDomisili: text("jumlah_tahun_domisili").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganDomisiliRelations = relations(
  suratKeteranganDomisiliTable,
  ({ one, many }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganDomisiliTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
    keluarga: many(suratKeteranganDomisiliKeluargaTable),
  }),
)

export const suratKeteranganDomisiliKeluargaTable = pgTable(
  "_surat_keterangan_domisili_keluarga",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    suratKeteranganDomisiliId: text("surat_keterangan_domisili_id").notNull(),
    pendudukId: text("penduduk_id").notNull(),
  },
)

export const suratKeteranganDomisiliKeluargaRelations = relations(
  suratKeteranganDomisiliKeluargaTable,
  ({ one }) => ({
    suratKeteranganDomisili: one(suratKeteranganDomisiliTable, {
      fields: [suratKeteranganDomisiliKeluargaTable.suratKeteranganDomisiliId],
      references: [suratKeteranganDomisiliTable.id],
    }),
    penduduk: one(pendudukTable, {
      fields: [suratKeteranganDomisiliKeluargaTable.pendudukId],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganDomisiliSchema = createInsertSchema(
  suratKeteranganDomisiliTable,
)
export const updateSuratKeteranganDomisiliSchema = createUpdateSchema(
  suratKeteranganDomisiliTable,
)
export const insertSuratKeteranganDomisiliKeluargaSchema = createInsertSchema(
  suratKeteranganDomisiliKeluargaTable,
)

export type SelectSuratKeteranganDomisili =
  typeof suratKeteranganDomisiliTable.$inferSelect
export type InsertSuratKeteranganDomisili =
  typeof suratKeteranganDomisiliTable.$inferInsert
