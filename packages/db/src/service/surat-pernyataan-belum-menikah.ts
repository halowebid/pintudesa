import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratPernyataanBelumMenikahTable,
  type InsertSuratPernyataanBelumMenikah,
} from "../schema/surat-pernyataan-belum-menikah"

export const insertSuratPernyataanBelumMenikah = async (
  data: InsertSuratPernyataanBelumMenikah,
) => {
  const suratPernyataanBelumMenikah = await db
    .insert(suratPernyataanBelumMenikahTable)
    .values(data)
    .returning()

  return suratPernyataanBelumMenikah[0]
}

export const updateSuratPernyataanBelumMenikah = async (
  data: InsertSuratPernyataanBelumMenikah & { id: string },
) => {
  const suratPernyataanBelumMenikah = await db
    .update(suratPernyataanBelumMenikahTable)
    .set(data)
    .where(eq(suratPernyataanBelumMenikahTable.id, data.id))
    .returning()

  return suratPernyataanBelumMenikah[0]
}

export const deleteSuratPernyataanBelumMenikah = async (id: string) => {
  const suratPernyataanBelumMenikah = await db
    .delete(suratPernyataanBelumMenikahTable)
    .where(eq(suratPernyataanBelumMenikahTable.id, id))
    .returning()
  return suratPernyataanBelumMenikah[0]
}

export const getSuratPernyataanBelumMenikahs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratPernyataanBelumMenikahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratPernyataanBelumMenikahById = async (id: string) => {
  return await db.query.suratPernyataanBelumMenikahTable.findFirst({
    where: eq(suratPernyataanBelumMenikahTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

export const searchSuratPernyataanBelumMenikahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratPernyataanBelumMenikahTable.findMany({
    where: (suratPernyataanBelumMenikahs, { ilike }) =>
      ilike(suratPernyataanBelumMenikahs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratPernyataanBelumMenikahs = async () => {
  const suratPernyataanBelumMenikah = await db
    .select({ value: count() })
    .from(suratPernyataanBelumMenikahTable)
  return suratPernyataanBelumMenikah[0]?.value ?? 0
}
