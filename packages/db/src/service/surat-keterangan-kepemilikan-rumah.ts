import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganKepemilikanRumahTable,
  type InsertSuratKeteranganKepemilikanRumah,
} from "../schema/surat-keterangan-kepemilikan-rumah"

export const insertSuratKeteranganKepemilikanRumah = async (
  data: InsertSuratKeteranganKepemilikanRumah,
) => {
  const suratKeteranganKepemilikanRumah = await db
    .insert(suratKeteranganKepemilikanRumahTable)
    .values(data)
    .returning()

  return suratKeteranganKepemilikanRumah[0]
}

export const updateSuratKeteranganKepemilikanRumah = async (
  data: InsertSuratKeteranganKepemilikanRumah & { id: string },
) => {
  const suratKeteranganKepemilikanRumah = await db
    .update(suratKeteranganKepemilikanRumahTable)
    .set(data)
    .where(eq(suratKeteranganKepemilikanRumahTable.id, data.id))
    .returning()

  return suratKeteranganKepemilikanRumah[0]
}

export const deleteSuratKeteranganKepemilikanRumah = async (id: string) => {
  const suratKeteranganKepemilikanRumah = await db
    .delete(suratKeteranganKepemilikanRumahTable)
    .where(eq(suratKeteranganKepemilikanRumahTable.id, id))
    .returning()
  return suratKeteranganKepemilikanRumah[0]
}

export const getSuratKeteranganKepemilikanRumahs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganKepemilikanRumahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratKeteranganKepemilikanRumahById = async (id: string) => {
  return await db.query.suratKeteranganKepemilikanRumahTable.findFirst({
    where: eq(suratKeteranganKepemilikanRumahTable.id, id),
  })
}

export const searchSuratKeteranganKepemilikanRumahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganKepemilikanRumahTable.findMany({
    where: (suratKeteranganKepemilikanRumahs, { ilike }) =>
      ilike(suratKeteranganKepemilikanRumahs.alamatRumah, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratKeteranganKepemilikanRumahs = async () => {
  const suratKeteranganKepemilikanRumah = await db
    .select({ value: count() })
    .from(suratKeteranganKepemilikanRumahTable)
  return suratKeteranganKepemilikanRumah[0]?.value ?? 0
}
