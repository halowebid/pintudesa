import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { pendudukTable } from "./penduduk"

export const suratKeteranganKematianTable = pgTable(
  "surat_keterangan_kematian",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    tanggalMeninggal: timestamp("tanggal_meninggal", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    lokasiMeninggal: text("lokasi_meninggal").notNull(),
    sebabMeninggal: text("sebab_meninggal"),
    lokasiPemakaman: text("lokasi_pemakaman").notNull(),
    tanggalPemakaman: timestamp("tanggal_pemakaman", {
      withTimezone: true,
      mode: "date",
    }),
    nik: text("nik")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratKeteranganKematianRelations = relations(
  suratKeteranganKematianTable,
  ({ one }) => ({
    penduduk: one(pendudukTable, {
      fields: [suratKeteranganKematianTable.nik],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKeteranganKematianSchema = createInsertSchema(
  suratKeteranganKematianTable,
)
export const updateSuratKeteranganKematianSchema = createUpdateSchema(
  suratKeteranganKematianTable,
)

export type SelectSuratKeteranganKematian =
  typeof suratKeteranganKematianTable.$inferSelect
export type InsertSuratKeteranganKematian =
  typeof suratKeteranganKematianTable.$inferInsert
