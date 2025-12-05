import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { createCustomId } from "@/lib/utils"
import { jenisPekerjaanEnum } from "./jenis-pekerjaan"
import { pendudukTable } from "./penduduk"

export const suratKuasaSKGRTable = pgTable("surat_kuasa_skgr", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  yangDiberiKuasaNama: text("yang_diberi_kuasa_nama").notNull(),
  yangDiberiKuasaTempatLahir: text("yang_diberi_kuasa_tempat_lahir").notNull(),
  yangDiberiKuasaTanggalLahir: timestamp("yang_diberi_kuasa_tanggal_lahir", {
    withTimezone: true,
    mode: "date",
  }),
  yangDiberiKuasaPekerjaan: jenisPekerjaanEnum(
    "yang_diberi_kuasa_pekerjaan",
  ).notNull(),
  yangDiberiKuasaAlamat: text("yang_diberi_kuasa_alamat").notNull(),
  yangDiberiKuasaAlamatWilayah: text(
    "yang_diberi_kuasa_alamat_wilayah",
  ).notNull(),
  kuasaUntuk: text("kuasa_untuk").notNull(),
  kuasaAtas: text("kuasa_atas").notNull(),
  tujuanKuasa: text("tujuan_kuasa").notNull(),
  atasNama: text("atas_nama").notNull(),
  noReg: text("no_reg").notNull(),
  tanggalSurat: timestamp("tanggal_surat", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  lokasiTanah: text("lokasi_tanah").notNull(),
  luasTanah: text("luas_tanah").notNull(),
  kuasaDariId: text("kuasa_dari_id")
    .notNull()
    .references(() => pendudukTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const suratKuasaSKGRRelations = relations(
  suratKuasaSKGRTable,
  ({ one }) => ({
    kuasaDari: one(pendudukTable, {
      fields: [suratKuasaSKGRTable.kuasaDariId],
      references: [pendudukTable.id],
    }),
  }),
)

export const insertSuratKuasaSKGRSchema =
  createInsertSchema(suratKuasaSKGRTable)
export const updateSuratKuasaSKGRSchema =
  createUpdateSchema(suratKuasaSKGRTable)

export type SelectSuratKuasaSKGR = typeof suratKuasaSKGRTable.$inferSelect
export type InsertSuratKuasaSKGR = typeof suratKuasaSKGRTable.$inferInsert
