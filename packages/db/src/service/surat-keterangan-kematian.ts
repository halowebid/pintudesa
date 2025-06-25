import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganKematianTable,
  type InsertSuratKeteranganKematian,
} from "../schema/surat-keterangan-kematian"

export const insertSuratKeteranganKematian = async (
  data: InsertSuratKeteranganKematian,
) => {
  const suratKeteranganKematian = await db
    .insert(suratKeteranganKematianTable)
    .values(data)
    .returning()

  return suratKeteranganKematian[0]
}

export const updateSuratKeteranganKematian = async (
  data: InsertSuratKeteranganKematian & { id: string },
) => {
  const suratKeteranganKematian = await db
    .update(suratKeteranganKematianTable)
    .set(data)
    .where(eq(suratKeteranganKematianTable.id, data.id))
    .returning()

  return suratKeteranganKematian[0]
}

export const deleteSuratKeteranganKematian = async (id: string) => {
  const suratKeteranganKematian = await db
    .delete(suratKeteranganKematianTable)
    .where(eq(suratKeteranganKematianTable.id, id))
    .returning()
  return suratKeteranganKematian[0]
}

export const getSuratKeteranganKematians = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganKematianTable.findMany({
    with: {
      penduduk: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getSuratKeteranganKematianById = async (id: string) => {
  return await db.query.suratKeteranganKematianTable.findFirst({
    where: eq(suratKeteranganKematianTable.id, id),
    with: {
      penduduk: true,
    },
  })
}

export const searchSuratKeteranganKematians = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganKematianTable.findMany({
    with: {
      penduduk: true,
    },
    where: (suratKeteranganKematians, { ilike }) =>
      ilike(suratKeteranganKematians.id, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countSuratKeteranganKematians = async () => {
  const suratKeteranganKematian = await db
    .select({ value: count() })
    .from(suratKeteranganKematianTable)
  return suratKeteranganKematian[0]?.value ?? 0
}
