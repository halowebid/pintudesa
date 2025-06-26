import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratPengantarSKCKTable,
  type InsertSuratPengantarSKCK,
} from "../schema/surat-pengantar-skck"

export const insertSuratPengantarSKCK = async (
  data: InsertSuratPengantarSKCK,
) => {
  const suratPengantarSKCK = await db
    .insert(suratPengantarSKCKTable)
    .values(data)
    .returning()

  return suratPengantarSKCK[0]
}

export const updateSuratPengantarSKCK = async (
  data: InsertSuratPengantarSKCK & { id: string },
) => {
  const suratPengantarSKCK = await db
    .update(suratPengantarSKCKTable)
    .set(data)
    .where(eq(suratPengantarSKCKTable.id, data.id))
    .returning()

  return suratPengantarSKCK[0]
}

export const deleteSuratPengantarSKCK = async (id: string) => {
  const suratPengantarSKCK = await db
    .delete(suratPengantarSKCKTable)
    .where(eq(suratPengantarSKCKTable.id, id))
    .returning()
  return suratPengantarSKCK[0]
}

export const getSuratPengantarSKCKs = async (page: number, perPage: number) => {
  return await db.query.suratPengantarSKCKTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratPengantarSKCKById = async (id: string) => {
  return await db.query.suratPengantarSKCKTable.findFirst({
    where: eq(suratPengantarSKCKTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

export const searchSuratPengantarSKCKs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratPengantarSKCKTable.findMany({
    where: (suratPengantarSKCKs, { ilike }) =>
      ilike(suratPengantarSKCKs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratPengantarSKCKs = async () => {
  const suratPengantarSKCK = await db
    .select({ value: count() })
    .from(suratPengantarSKCKTable)
  return suratPengantarSKCK[0]?.value ?? 0
}
