import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganKelahiranTable,
  type InsertSuratKeteranganKelahiran,
} from "../schema/surat-keterangan-kelahiran"

export const insertSuratKeteranganKelahiran = async (
  data: InsertSuratKeteranganKelahiran,
) => {
  const suratKeteranganKelahiran = await db
    .insert(suratKeteranganKelahiranTable)
    .values(data)
    .returning()

  return suratKeteranganKelahiran[0]
}

export const updateSuratKeteranganKelahiran = async (
  data: InsertSuratKeteranganKelahiran & { id: string },
) => {
  const suratKeteranganKelahiran = await db
    .update(suratKeteranganKelahiranTable)
    .set(data)
    .where(eq(suratKeteranganKelahiranTable.id, data.id))
    .returning()

  return suratKeteranganKelahiran[0]
}

export const deleteSuratKeteranganKelahiran = async (id: string) => {
  const suratKeteranganKelahiran = await db
    .delete(suratKeteranganKelahiranTable)
    .where(eq(suratKeteranganKelahiranTable.id, id))
    .returning()
  return suratKeteranganKelahiran[0]
}

export const getSuratKeteranganKelahirans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganKelahiranTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratKeteranganKelahiranById = async (id: string) => {
  return await db.query.suratKeteranganKelahiranTable.findFirst({
    where: eq(suratKeteranganKelahiranTable.id, id),
  })
}

export const searchSuratKeteranganKelahirans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganKelahiranTable.findMany({
    where: (suratKeteranganKelahirans, { ilike }) =>
      ilike(suratKeteranganKelahirans.namaAnak, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratKeteranganKelahirans = async () => {
  const suratKeteranganKelahiran = await db
    .select({ value: count() })
    .from(suratKeteranganKelahiranTable)
  return suratKeteranganKelahiran[0]?.value ?? 0
}
