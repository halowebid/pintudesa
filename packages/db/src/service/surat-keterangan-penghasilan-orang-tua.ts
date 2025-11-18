import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganPenghasilanOrangTuaTable,
  type InsertSuratKeteranganPenghasilanOrangTua,
} from "../schema/surat-keterangan-penghasilan-orang-tua"

export const insertSuratKeteranganPenghasilanOrangTua = async (
  data: InsertSuratKeteranganPenghasilanOrangTua,
) => {
  const suratKeteranganPenghasilanOrangTua = await db
    .insert(suratKeteranganPenghasilanOrangTuaTable)
    .values(data)
    .returning()

  return suratKeteranganPenghasilanOrangTua[0]
}

export const updateSuratKeteranganPenghasilanOrangTua = async (
  data: InsertSuratKeteranganPenghasilanOrangTua & { id: string },
) => {
  const suratKeteranganPenghasilanOrangTua = await db
    .update(suratKeteranganPenghasilanOrangTuaTable)
    .set(data)
    .where(eq(suratKeteranganPenghasilanOrangTuaTable.id, data.id))
    .returning()

  return suratKeteranganPenghasilanOrangTua[0]
}

export const deleteSuratKeteranganPenghasilanOrangTua = async (id: string) => {
  const suratKeteranganPenghasilanOrangTua = await db
    .delete(suratKeteranganPenghasilanOrangTuaTable)
    .where(eq(suratKeteranganPenghasilanOrangTuaTable.id, id))
    .returning()
  return suratKeteranganPenghasilanOrangTua[0]
}

export const getSuratKeteranganPenghasilanOrangTuas = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganPenghasilanOrangTuaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

export const getSuratKeteranganPenghasilanOrangTuaById = async (id: string) => {
  return await db.query.suratKeteranganPenghasilanOrangTuaTable.findFirst({
    where: eq(suratKeteranganPenghasilanOrangTuaTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

export const searchSuratKeteranganPenghasilanOrangTuas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganPenghasilanOrangTuaTable.findMany({
    where: (suratKeteranganPenghasilanOrangTuas, { ilike }) =>
      ilike(suratKeteranganPenghasilanOrangTuas.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

export const countSuratKeteranganPenghasilanOrangTuas = async () => {
  const suratKeteranganPenghasilanOrangTua = await db
    .select({ value: count() })
    .from(suratKeteranganPenghasilanOrangTuaTable)
  return suratKeteranganPenghasilanOrangTua[0]?.value ?? 0
}
