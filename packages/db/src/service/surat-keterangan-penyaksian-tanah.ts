import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganPenyaksianTanahTable,
  type InsertSuratKeteranganPenyaksianTanah,
} from "../schema/surat-keterangan-penyaksian-tanah"

export const insertSuratKeteranganPenyaksianTanah = async (
  data: InsertSuratKeteranganPenyaksianTanah & {
    pendudukIds: string[]
  },
) => {
  const suratKeteranganPenyaksianTanah = await db
    .insert(suratKeteranganPenyaksianTanahTable)
    .values(data)
    .returning()

  return suratKeteranganPenyaksianTanah[0]
}

export const updateSuratKeteranganPenyaksianTanah = async (
  data: InsertSuratKeteranganPenyaksianTanah & { id: string },
) => {
  const suratKeteranganPenyaksianTanah = await db
    .update(suratKeteranganPenyaksianTanahTable)
    .set(data)
    .where(eq(suratKeteranganPenyaksianTanahTable.id, data.id))
    .returning()

  return suratKeteranganPenyaksianTanah[0]
}

export const deleteSuratKeteranganPenyaksianTanah = async (id: string) => {
  const suratKeteranganPenyaksianTanah = await db
    .delete(suratKeteranganPenyaksianTanahTable)
    .where(eq(suratKeteranganPenyaksianTanahTable.id, id))
    .returning()
  return suratKeteranganPenyaksianTanah[0]
}

export const getSuratKeteranganPenyaksianTanahs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganPenyaksianTanahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratKeteranganPenyaksianTanahById = async (id: string) => {
  return await db.query.suratKeteranganPenyaksianTanahTable.findFirst({
    where: eq(suratKeteranganPenyaksianTanahTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

export const searchSuratKeteranganPenyaksianTanahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganPenyaksianTanahTable.findMany({
    where: (suratKeteranganPenyaksianTanahs, { ilike }) =>
      ilike(suratKeteranganPenyaksianTanahs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratKeteranganPenyaksianTanahs = async () => {
  const suratKeteranganPenyaksianTanah = await db
    .select({ value: count() })
    .from(suratKeteranganPenyaksianTanahTable)
  return suratKeteranganPenyaksianTanah[0]?.value ?? 0
}
