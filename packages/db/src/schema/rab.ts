import { createCustomId } from "@pintudesa/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const rabTable = pgTable("rab", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  bidang: text("bidang").notNull(),
  waktuPelaksanaan: text("waktu_pelaksanaan").notNull(),
  kegiatan: text("kegiatan").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertRABSchema = createInsertSchema(rabTable)
export const updateRABSchema = createUpdateSchema(rabTable)

export type SelectRAB = typeof rabTable.$inferSelect
export type InsertRAB = typeof rabTable.$inferInsert
