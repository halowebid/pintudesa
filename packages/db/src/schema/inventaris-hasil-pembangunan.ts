import { createCustomId } from "@pintudesa/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const inventarisHasilPembangunanTable = pgTable(
  "inventaris_hasil_pembangunan",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    namaHasilPembangunan: text("nama_hasil_pembangunan").notNull(),
    volume: text("volume").notNull(),
    biaya: text("biaya").notNull(),
    lokasi: text("lokasi").notNull(),
    keteranganTambahan: text("keterangan_tambahan"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const insertInventarisHasilPembangunanSchema = createInsertSchema(
  inventarisHasilPembangunanTable,
)
export const updateInventarisHasilPembangunanSchema = createUpdateSchema(
  inventarisHasilPembangunanTable,
)

export type SelectInventarisHasilPembangunan =
  typeof inventarisHasilPembangunanTable.$inferSelect
export type InsertInventarisHasilPembangunan =
  typeof inventarisHasilPembangunanTable.$inferInsert
