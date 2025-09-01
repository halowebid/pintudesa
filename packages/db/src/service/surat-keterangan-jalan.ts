import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganJalanTable,
  type InsertSuratKeteranganJalan,
} from "../schema/surat-keterangan-jalan"

export const insertSuratKeteranganJalan = async (
  data: InsertSuratKeteranganJalan & {
    pendudukIds: string[]
  },
) => {
  const suratKeteranganJalan = await db
    .insert(suratKeteranganJalanTable)
    .values(data)
    .returning()

  return suratKeteranganJalan[0]
}

export const updateSuratKeteranganJalan = async (
  data: InsertSuratKeteranganJalan & { id: string },
) => {
  const suratKeteranganJalan = await db
    .update(suratKeteranganJalanTable)
    .set(data)
    .where(eq(suratKeteranganJalanTable.id, data.id))
    .returning()

  return suratKeteranganJalan[0]
}

export const deleteSuratKeteranganJalan = async (id: string) => {
  const suratKeteranganJalan = await db
    .delete(suratKeteranganJalanTable)
    .where(eq(suratKeteranganJalanTable.id, id))
    .returning()
  return suratKeteranganJalan[0]
}

export const getSuratKeteranganJalans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganJalanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getSuratKeteranganJalanById = async (id: string) => {
  return await db.query.suratKeteranganJalanTable.findFirst({
    where: eq(suratKeteranganJalanTable.id, id),
  })
}

export const searchSuratKeteranganJalans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganJalanTable.findMany({
    where: (suratKeteranganJalans, { ilike }) =>
      ilike(suratKeteranganJalans.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countSuratKeteranganJalans = async () => {
  const suratKeteranganJalan = await db
    .select({ value: count() })
    .from(suratKeteranganJalanTable)
  return suratKeteranganJalan[0]?.value ?? 0
}
