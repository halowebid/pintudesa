import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import z from "zod"

import { createCustomId } from "@/lib/utils/custom-id"
import { kategoriPendudukEnum } from "./kategori-penduduk"
import { pendudukTable } from "./penduduk"

export const SHDK = [
  "suami",
  "pembantu",
  "orangtua",
  "mertua",
  "menantu",
  "kepala_keluarga",
  "istri",
  "cucu",
  "anak",
  "lainnya",
] as const

export const shdk = z.enum(SHDK)

export const shdkEnum = pgEnum("shdk", SHDK)

export const kartuKeluargaTable = pgTable("kartu_keluarga", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  kategoriPenduduk: kategoriPendudukEnum("kategori_penduduk").default(
    "penduduk_dalam_desa",
  ),
  nomorKartuKeluarga: text("nomor_kartu_keluarga").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const anggotaKeluargaTable = pgTable("anggota_keluarga", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  kartuKeluargaId: text("kartu_keluarga_id")
    .notNull()
    .references(() => kartuKeluargaTable.id, { onDelete: "cascade" }),
  pendudukId: text("penduduk_id")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  shdk: shdkEnum("shdk").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const kartuKeluargaRelations = relations(
  kartuKeluargaTable,
  ({ many }) => ({
    anggotaKeluarga: many(anggotaKeluargaTable),
  }),
)

export const anggotaKeluargaRelations = relations(
  anggotaKeluargaTable,
  ({ one }) => ({
    penduduk: one(pendudukTable, {
      fields: [anggotaKeluargaTable.pendudukId],
      references: [pendudukTable.id],
    }),
    kartuKeluarga: one(kartuKeluargaTable, {
      fields: [anggotaKeluargaTable.kartuKeluargaId],
      references: [kartuKeluargaTable.id],
    }),
  }),
)

export const insertKartuKeluargaSchema = createInsertSchema(kartuKeluargaTable)
export const insertAnggotaKeluargaSchema =
  createInsertSchema(anggotaKeluargaTable)
export const updateKartuKeluargaSchema = createUpdateSchema(kartuKeluargaTable)
export const updateAnggotaKeluargaSchema =
  createUpdateSchema(anggotaKeluargaTable)

export type SelectKartuKeluarga = typeof kartuKeluargaTable.$inferSelect
export type InsertKartuKeluarga = typeof kartuKeluargaTable.$inferInsert

export type SHDK = z.infer<typeof shdk>
