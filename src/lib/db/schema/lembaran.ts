import { createCustomId } from "@/lib/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { jenisPeraturanEnum } from "./peraturan"

export const lembaranTable = pgTable("lembaran", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  jenisPeraturan:
    jenisPeraturanEnum("jenis_peraturan").default("peraturan_desa"),
  nomorDitetapkan: text("nomor_ditetapkan").notNull(),
  tanggalDitetapkan: timestamp("tanggal_ditetapkan", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  nomorDiundangkan: text("nomor_diundangkan").notNull(),
  tanggalDiundangkan: timestamp("tanggal_diundangkan", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  tentang: text("tentang"),
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertLembaranSchema = createInsertSchema(lembaranTable)
export const updateLembaranSchema = createUpdateSchema(lembaranTable)

export type SelectLembaran = typeof lembaranTable.$inferSelect
export type InsertLembaran = typeof lembaranTable.$inferInsert
