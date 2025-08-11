import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganDomisiliTable,
  type InsertSuratKeteranganDomisili,
} from "../schema/surat-keterangan-domisili"

export const insertSuratKeteranganDomisili = async (
  data: InsertSuratKeteranganDomisili,
) => {
  const suratKeteranganDomisili = await db
    .insert(suratKeteranganDomisiliTable)
    .values(data)
    .returning()

  return suratKeteranganDomisili[0]
}

export const updateSuratKeteranganDomisili = async (
  data: InsertSuratKeteranganDomisili & { id: string },
) => {
  const suratKeteranganDomisili = await db
    .update(suratKeteranganDomisiliTable)
    .set(data)
    .where(eq(suratKeteranganDomisiliTable.id, data.id))
    .returning()

  return suratKeteranganDomisili[0]
}

export const deleteSuratKeteranganDomisili = async (id: string) => {
  const suratKeteranganDomisili = await db
    .delete(suratKeteranganDomisiliTable)
    .where(eq(suratKeteranganDomisiliTable.id, id))
    .returning()
  return suratKeteranganDomisili[0]
}

export const getSuratKeteranganDomisilis = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganDomisiliTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      keluarga: true,
    },
  })
}

export const getSuratKeteranganDomisiliById = async (id: string) => {
  return await db.query.suratKeteranganDomisiliTable.findFirst({
    where: eq(suratKeteranganDomisiliTable.id, id),
    with: {
      keluarga: true,
    },
  })
}

export const searchSuratKeteranganDomisilis = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganDomisiliTable.findMany({
    where: (suratKeteranganDomisilis, { ilike }) =>
      ilike(suratKeteranganDomisilis.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      keluarga: true,
    },
  })
}

export const countSuratKeteranganDomisilis = async () => {
  const suratKeteranganDomisili = await db
    .select({ value: count() })
    .from(suratKeteranganDomisiliTable)
  return suratKeteranganDomisili[0]?.value ?? 0
}
