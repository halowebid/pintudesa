import { createCustomId } from "@/lib/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratPengantarSKCKTable = pgTable("surat_pengantar_skck", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  pemohonNIK: text("pemohon_nik")
    .notNull()
    .references(() => pendudukTable.id, {
      onDelete: "cascade",
    }),
  tujuanPembuatan: text("tujuan_pembuatan").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratPengantarSKCKRelations = relations(
  suratPengantarSKCKTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratPengantarSKCKTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratPengantarSKCKSchema = createInsertSchema(
  suratPengantarSKCKTable,
)
export const updateSuratPengantarSKCKSchema = createUpdateSchema(
  suratPengantarSKCKTable,
)

export type SelectSuratPengantarSKCK =
  typeof suratPengantarSKCKTable.$inferSelect
export type InsertSuratPengantarSKCK =
  typeof suratPengantarSKCKTable.$inferInsert
