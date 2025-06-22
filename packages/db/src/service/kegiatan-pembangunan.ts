import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  kegiatanPembangunanTable,
  type InsertKegiatanPembangunan,
} from "../schema/kegiatan-pembangunan"

export const insertKegiatanPembangunan = async (
  data: InsertKegiatanPembangunan,
) => {
  const kegiatanPembangunan = await db
    .insert(kegiatanPembangunanTable)
    .values(data)
    .returning()

  return kegiatanPembangunan[0]
}

export const updateKegiatanPembangunan = async (
  data: InsertKegiatanPembangunan & { id: string },
) => {
  const kegiatanPembangunan = await db
    .update(kegiatanPembangunanTable)
    .set(data)
    .where(eq(kegiatanPembangunanTable.id, data.id))
    .returning()

  return kegiatanPembangunan[0]
}

export const deleteKegiatanPembangunan = async (id: string) => {
  const kegiatanPembangunan = await db
    .delete(kegiatanPembangunanTable)
    .where(eq(kegiatanPembangunanTable.id, id))
    .returning()
  return kegiatanPembangunan[0]
}

export const getKegiatanPembangunans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.kegiatanPembangunanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getKegiatanPembangunanById = async (id: string) => {
  return await db.query.kegiatanPembangunanTable.findFirst({
    where: eq(kegiatanPembangunanTable.id, id),
  })
}

export const searchKegiatanPembangunans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.kegiatanPembangunanTable.findMany({
    where: (kegiatanPembangunans, { ilike }) =>
      ilike(kegiatanPembangunans.namaKegiatan, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countKegiatanPembangunans = async () => {
  const kegiatanPembangunan = await db
    .select({ value: count() })
    .from(kegiatanPembangunanTable)
  return kegiatanPembangunan[0]?.value ?? 0
}
