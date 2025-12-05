import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"
import { pendudukTable } from "./penduduk"

export const suratKeteranganGaibTable = pgTable("surat_keterangan_gaib", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  pasangan: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  tanggalDitinggal: timestamp("tanggal_ditinggal", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratKeteranganGaibRelations = relations(
  suratKeteranganGaibTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganGaibTable.pemohonNIK],
      references: [pendudukTable.id],
      relationName: "pemohon",
    }),
    pasangan: one(pendudukTable, {
      fields: [suratKeteranganGaibTable.pasangan],
      references: [pendudukTable.id],
      relationName: "pasangan",
    }),
  }),
)

export const insertSuratKeteranganGaibSchema = createInsertSchema(
  suratKeteranganGaibTable,
)
export const updateSuratKeteranganGaibSchema = createUpdateSchema(
  suratKeteranganGaibTable,
)

export type SelectSuratKeteranganGaib =
  typeof suratKeteranganGaibTable.$inferSelect
export type InsertSuratKeteranganGaib =
  typeof suratKeteranganGaibTable.$inferInsert
