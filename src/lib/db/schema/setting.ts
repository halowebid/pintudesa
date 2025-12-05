import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"

export const settingTable = pgTable("setting", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertSettingSchema = createInsertSchema(settingTable)
export const updateSettingSchema = createUpdateSchema(settingTable)

export type SelectSetting = typeof settingTable.$inferSelect
export type InsertSetting = typeof settingTable.$inferInsert
