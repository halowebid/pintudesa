import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"

export const beritaTable = pgTable("berita", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  judul: text("judul").notNull(),
  slug: text("slug").unique().notNull(),
  uraian: text("uraian").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertBeritaSchema = createInsertSchema(beritaTable)
export const updateBeritaSchema = createUpdateSchema(beritaTable)

export type SelectBerita = typeof beritaTable.$inferSelect
export type InsertBerita = typeof beritaTable.$inferInsert
