import { createCustomId } from "@/lib/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const ekspedisiTable = pgTable("ekspedisi", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  nomorSurat: text("nomor_surat").notNull(),
  tanggalSurat: timestamp("tanggal_surat", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  ditujukan: text("ditujukan").notNull(),
  tanggalPengiriman: timestamp("tanggal_pengiriman", {
    withTimezone: true,
    mode: "date",
  }),
  uraianSurat: text("uraian_surat").notNull(),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertEkspedisiSchema = createInsertSchema(ekspedisiTable)
export const updateEkspedisiSchema = createUpdateSchema(ekspedisiTable)

export type SelectEkspedisi = typeof ekspedisiTable.$inferSelect
export type InsertEkspedisi = typeof ekspedisiTable.$inferInsert
