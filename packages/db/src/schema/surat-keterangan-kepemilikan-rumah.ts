import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganKepemilikanRumahTable = pgTable(
  "surat_keterangan_kepemilikan_rumah",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, {
        onDelete: "cascade",
      }),
    alamatRumah: text("alamat_rumah").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganKepemilikanRumahRelations = relations(
  suratKeteranganKepemilikanRumahTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratKeteranganKepemilikanRumahTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganKepemilikanRumahSchema = createInsertSchema(
  suratKeteranganKepemilikanRumahTable,
)
export const updateSuratKeteranganKepemilikanRumahSchema = createUpdateSchema(
  suratKeteranganKepemilikanRumahTable,
)

export type SelectSuratKeteranganKepemilikanRumah =
  typeof suratKeteranganKepemilikanRumahTable.$inferSelect
export type InsertSuratKeteranganKepemilikanRumah =
  typeof suratKeteranganKepemilikanRumahTable.$inferInsert
