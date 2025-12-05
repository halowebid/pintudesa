import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import z from "zod"

import { createCustomId } from "@/lib/utils"

export const JENIS_SURAT_AGENDA = ["surat_masuk", "surat_keluar"] as const

export const jenisSuratAgenda = z.enum(JENIS_SURAT_AGENDA)

export const jenisSuratAgendaEnum = pgEnum(
  "jenis_surat_agenda",
  JENIS_SURAT_AGENDA,
)

export const agendaTable = pgTable("agenda", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  jenisSurat: jenisSuratAgendaEnum("jenis_surat").default("surat_masuk"),
  uraian: text("uraian").notNull(),
  keteranganTambahan: text("keterangan_tambahan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertAgendaSchema = createInsertSchema(agendaTable)
export const updateAgendaSchema = createUpdateSchema(agendaTable)

export type SelectAgenda = typeof agendaTable.$inferSelect
export type InsertAgenda = typeof agendaTable.$inferInsert

export type JenisSuratAgenda = z.infer<typeof jenisSuratAgenda>
