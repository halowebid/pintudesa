import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganPenghasilanTable,
  type InsertSuratKeteranganPenghasilan,
} from "../schema/surat-keterangan-penghasilan"

export const insertSuratKeteranganPenghasilan = async (
  data: InsertSuratKeteranganPenghasilan,
) => {
  const suratKeteranganPenghasilan = await db
    .insert(suratKeteranganPenghasilanTable)
    .values(data)
    .returning()

  return suratKeteranganPenghasilan[0]
}

export const updateSuratKeteranganPenghasilan = async (
  data: InsertSuratKeteranganPenghasilan & { id: string },
) => {
  const suratKeteranganPenghasilan = await db
    .update(suratKeteranganPenghasilanTable)
    .set(data)
    .where(eq(suratKeteranganPenghasilanTable.id, data.id))
    .returning()

  return suratKeteranganPenghasilan[0]
}

export const deleteSuratKeteranganPenghasilan = async (id: string) => {
  const suratKeteranganPenghasilan = await db
    .delete(suratKeteranganPenghasilanTable)
    .where(eq(suratKeteranganPenghasilanTable.id, id))
    .returning()
  return suratKeteranganPenghasilan[0]
}

export const getSuratKeteranganPenghasilans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganPenghasilanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratKeteranganPenghasilanById = async (id: string) => {
  return await db.query.suratKeteranganPenghasilanTable.findFirst({
    where: eq(suratKeteranganPenghasilanTable.id, id),
  })
}

export const searchSuratKeteranganPenghasilans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganPenghasilanTable.findMany({
    where: (suratKeteranganPenghasilans, { ilike }) =>
      ilike(suratKeteranganPenghasilans.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratKeteranganPenghasilans = async () => {
  const suratKeteranganPenghasilan = await db
    .select({ value: count() })
    .from(suratKeteranganPenghasilanTable)
  return suratKeteranganPenghasilan[0]?.value ?? 0
}
