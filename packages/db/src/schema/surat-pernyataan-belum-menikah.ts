import { createCustomId } from "@pintudesa/utils"
import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { shdkEnum } from "./anggota-keluarga"
import { pendudukTable } from "./penduduk"

export const suratPernyataanBelumMenikahTable = pgTable(
  "surat_pernyataan_belum_menikah",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    pemohonNIK: text("pemohon_nik")
      .notNull()
      .references(() => pendudukTable.id, { onDelete: "cascade" }),
    namaSaksi1: text("nama_saksi_1").notNull(),
    hubunganSaksi1: shdkEnum("hubungan_saksi_1").notNull(),
    namaSaksi2: text("nama_saksi_2"),
    hubunganSaksi2: shdkEnum("hubungan_saksi_2"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
)

export const suratPernyataanBelumMenikahRelastions = relations(
  suratPernyataanBelumMenikahTable,
  ({ one }) => ({
    pemohon: one(pendudukTable, {
      fields: [suratPernyataanBelumMenikahTable.pemohonNIK],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratPernyataanBelumMenikahSchema = createInsertSchema(
  suratPernyataanBelumMenikahTable,
)
export const updateSuratPernyataanBelumMenikahSchema = createUpdateSchema(
  suratPernyataanBelumMenikahTable,
)

export type SelectSuratPernyataanBelumMenikah =
  typeof suratPernyataanBelumMenikahTable.$inferSelect
export type InsertSuratPernyataanBelumMenikah =
  typeof suratPernyataanBelumMenikahTable.$inferInsert
