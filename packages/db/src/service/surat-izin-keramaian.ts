import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratIzinKeramaianTable,
  type InsertSuratIzinKeramaian,
} from "../schema/surat-izin-keramaian"

export const insertSuratIzinKeramaian = async (
  data: InsertSuratIzinKeramaian,
) => {
  const suratIzinKeramaian = await db
    .insert(suratIzinKeramaianTable)
    .values(data)
    .returning()

  return suratIzinKeramaian[0]
}

export const updateSuratIzinKeramaian = async (
  data: InsertSuratIzinKeramaian & { id: string },
) => {
  const suratIzinKeramaian = await db
    .update(suratIzinKeramaianTable)
    .set(data)
    .where(eq(suratIzinKeramaianTable.id, data.id))
    .returning()

  return suratIzinKeramaian[0]
}

export const deleteSuratIzinKeramaian = async (id: string) => {
  const suratIzinKeramaian = await db
    .delete(suratIzinKeramaianTable)
    .where(eq(suratIzinKeramaianTable.id, id))
    .returning()
  return suratIzinKeramaian[0]
}

export const getSuratIzinKeramaians = async (page: number, perPage: number) => {
  return await db.query.suratIzinKeramaianTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratIzinKeramaianById = async (id: string) => {
  return await db.query.suratIzinKeramaianTable.findFirst({
    where: eq(suratIzinKeramaianTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

export const searchSuratIzinKeramaians = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratIzinKeramaianTable.findMany({
    where: (suratIzinKeramaians, { ilike }) =>
      ilike(suratIzinKeramaians.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratIzinKeramaians = async () => {
  const suratIzinKeramaian = await db
    .select({ value: count() })
    .from(suratIzinKeramaianTable)
  return suratIzinKeramaian[0]?.value ?? 0
}
