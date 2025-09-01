import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganPenghasilanTable = pgTable(
  "surat_keteragan_penghasilan",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, {
        onDelete: "cascade",
      }),
    penghasilan: text("penghasilan").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganPenghasilanRelations = relations(
  suratKeteranganPenghasilanTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganPenghasilanTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganPenghasilanSchema = createInsertSchema(
  suratKeteranganPenghasilanTable,
)
export const updateSuratKeteranganPenghasilanSchema = createUpdateSchema(
  suratKeteranganPenghasilanTable,
)

export type SelectSuratKeteranganPenghasilan =
  typeof suratKeteranganPenghasilanTable.$inferSelect
export type InsertSuratKeteranganPenghasilan =
  typeof suratKeteranganPenghasilanTable.$inferInsert
