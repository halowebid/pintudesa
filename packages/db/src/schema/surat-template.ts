import { createCustomId } from "@pintudesa/utils"
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

/**
 * Enum of all surat types in the system
 */
export const SURAT_TYPE_VALUES = [
  "surat-izin-keramaian",
  "surat-izin-mendirikan-bangunan",
  "surat-keterangan-beda-nama",
  "surat-keterangan-belum-memiliki-rumah",
  "surat-keterangan-domisili",
  "surat-keterangan-domisili-usaha",
  "surat-keterangan-gaib",
  "surat-keterangan-jalan",
  "surat-keterangan-kelahiran",
  "surat-keterangan-kematian",
  "surat-keterangan-kepemilikan-rumah",
  "surat-keterangan-penghasilan",
  "surat-keterangan-penghasilan-orang-tua",
  "surat-keterangan-penyaksian-tanah",
  "surat-keterangan-usaha",
  "surat-kuasa-ahli-waris",
  "surat-kuasa-skgr",
  "surat-pengantar-skck",
  "surat-pernyataan-belum-menikah",
  "surat-pindah-desa-bpn",
] as const

export type SuratType = (typeof SURAT_TYPE_VALUES)[number]

/**
 * Surat template table for storing HTML templates
 * Used for generating printable letters and PDF exports
 */
export const suratTemplateTable = pgTable(
  "surat_template",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    suratType: text("surat_type", {
      enum: SURAT_TYPE_VALUES,
    }).notNull(),
    name: text().notNull(),
    htmlContent: text("html_content").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("surat_template_type_idx").on(table.suratType)],
)

export const insertSuratTemplateSchema = createInsertSchema(suratTemplateTable)
export const updateSuratTemplateSchema = createUpdateSchema(suratTemplateTable)

export type SelectSuratTemplate = typeof suratTemplateTable.$inferSelect
export type InsertSuratTemplate = typeof suratTemplateTable.$inferInsert
