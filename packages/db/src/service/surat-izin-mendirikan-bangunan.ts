import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratIzinMendirikanBangunanTable,
  type InsertSuratIzinMendirikanBangunan,
} from "../schema/surat-izin-mendirikan-bangunan"

export const insertSuratIzinMendirikanBangunan = async (
  data: InsertSuratIzinMendirikanBangunan,
) => {
  const suratIzinMendirikanBangunan = await db
    .insert(suratIzinMendirikanBangunanTable)
    .values(data)
    .returning()

  return suratIzinMendirikanBangunan[0]
}

export const updateSuratIzinMendirikanBangunan = async (
  data: InsertSuratIzinMendirikanBangunan & { id: string },
) => {
  const suratIzinMendirikanBangunan = await db
    .update(suratIzinMendirikanBangunanTable)
    .set(data)
    .where(eq(suratIzinMendirikanBangunanTable.id, data.id))
    .returning()

  return suratIzinMendirikanBangunan[0]
}

export const deleteSuratIzinMendirikanBangunan = async (id: string) => {
  const suratIzinMendirikanBangunan = await db
    .delete(suratIzinMendirikanBangunanTable)
    .where(eq(suratIzinMendirikanBangunanTable.id, id))
    .returning()
  return suratIzinMendirikanBangunan[0]
}

export const getSuratIzinMendirikanBangunans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratIzinMendirikanBangunanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratIzinMendirikanBangunanById = async (id: string) => {
  return await db.query.suratIzinMendirikanBangunanTable.findFirst({
    where: eq(suratIzinMendirikanBangunanTable.id, id),
  })
}

export const searchSuratIzinMendirikanBangunans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratIzinMendirikanBangunanTable.findMany({
    where: (suratIzinMendirikanBangunans, { ilike }) =>
      ilike(suratIzinMendirikanBangunans.tujuanPembuatan, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratIzinMendirikanBangunans = async () => {
  const suratIzinMendirikanBangunan = await db
    .select({ value: count() })
    .from(suratIzinMendirikanBangunanTable)
  return suratIzinMendirikanBangunan[0]?.value ?? 0
}
