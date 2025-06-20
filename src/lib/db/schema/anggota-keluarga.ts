import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import z from "zod"

import { createCustomId } from "@/lib/utils/custom-id"
import { kartuKeluargaTable } from "./kartu-keluarga"
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

export const insertAnggotaKeluargaSchema =
  createInsertSchema(anggotaKeluargaTable)
export const updateAnggotaKeluargaSchema =
  createUpdateSchema(anggotaKeluargaTable)

export type SelectAnggotaKeluarga = typeof anggotaKeluargaTable.$inferSelect
export type InsertAnggotaKeluarga = typeof anggotaKeluargaTable.$inferInsert

export type SHDK = z.infer<typeof shdk>
