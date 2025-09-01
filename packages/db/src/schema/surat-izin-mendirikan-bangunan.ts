import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratIzinMendirikanBangunanTable = pgTable(
  "surat_izin_mendirikan_bangunan",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, {
        onDelete: "cascade",
      }),
    tujuanPembuatan: text("tujuan_pembuatan").notNull(),
    luasTanah: text("luas_tanah").notNull(),
    batasUtara: text("batas_utara").notNull(),
    batasSelatan: text("batas_selatan").notNull(),
    batasBarat: text("batas_barat").notNull(),
    batasTimur: text("batas_timur").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratIzinMendirikanBangunanRelations = relations(
  suratIzinMendirikanBangunanTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratIzinMendirikanBangunanTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratIzinMendirikanBangunanSchema = createInsertSchema(
  suratIzinMendirikanBangunanTable,
)
export const updateSuratIzinMendirikanBangunanSchema = createUpdateSchema(
  suratIzinMendirikanBangunanTable,
)

export type SelectSuratIzinMendirikanBangunan =
  typeof suratIzinMendirikanBangunanTable.$inferSelect
export type InsertSuratIzinMendirikanBangunan =
  typeof suratIzinMendirikanBangunanTable.$inferInsert
