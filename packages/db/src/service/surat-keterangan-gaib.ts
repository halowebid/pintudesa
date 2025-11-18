import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganGaibTable,
  type InsertSuratKeteranganGaib,
} from "../schema/surat-keterangan-gaib"

export const insertSuratKeteranganGaib = async (
  data: InsertSuratKeteranganGaib,
) => {
  const suratKeteranganGaib = await db
    .insert(suratKeteranganGaibTable)
    .values(data)
    .returning()

  return suratKeteranganGaib[0]
}

export const updateSuratKeteranganGaib = async (
  data: InsertSuratKeteranganGaib & { id: string },
) => {
  const suratKeteranganGaib = await db
    .update(suratKeteranganGaibTable)
    .set(data)
    .where(eq(suratKeteranganGaibTable.id, data.id))
    .returning()

  return suratKeteranganGaib[0]
}

export const deleteSuratKeteranganGaib = async (id: string) => {
  const suratKeteranganGaib = await db
    .delete(suratKeteranganGaibTable)
    .where(eq(suratKeteranganGaibTable.id, id))
    .returning()
  return suratKeteranganGaib[0]
}

export const getSuratKeteranganGaibs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganGaibTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
      pasangan: true,
    },
  })
}

export const getSuratKeteranganGaibById = async (id: string) => {
  return await db.query.suratKeteranganGaibTable.findFirst({
    where: eq(suratKeteranganGaibTable.id, id),
    with: {
      pemohon: true,
      pasangan: true,
    },
  })
}

export const searchSuratKeteranganGaibs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganGaibTable.findMany({
    where: (suratKeteranganGaibs, { ilike }) =>
      ilike(suratKeteranganGaibs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
      pasangan: true,
    },
  })
}

export const countSuratKeteranganGaibs = async () => {
  const suratKeteranganGaib = await db
    .select({ value: count() })
    .from(suratKeteranganGaibTable)
  return suratKeteranganGaib[0]?.value ?? 0
}
