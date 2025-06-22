import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  anggotaKeluargaTable,
  type InsertAnggotaKeluarga,
} from "../schema/anggota-keluarga"

export const insertAnggotaKeluarga = async (data: InsertAnggotaKeluarga) => {
  const anggotaKeluarga = await db
    .insert(anggotaKeluargaTable)
    .values(data)
    .returning()

  return anggotaKeluarga[0]
}

export const updateAnggotaKeluarga = async (
  data: InsertAnggotaKeluarga & { id: string },
) => {
  const anggotaKeluarga = await db
    .update(anggotaKeluargaTable)
    .set(data)
    .where(eq(anggotaKeluargaTable.id, data.id))
    .returning()

  return anggotaKeluarga[0]
}

export const deleteAnggotaKeluarga = async (id: string) => {
  const anggotaKeluarga = await db
    .delete(anggotaKeluargaTable)
    .where(eq(anggotaKeluargaTable.id, id))
    .returning()
  return anggotaKeluarga[0]
}

export const getAnggotaKeluargas = async (page: number, perPage: number) => {
  return await db.query.anggotaKeluargaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getAnggotaKeluargaById = async (id: string) => {
  return await db.query.anggotaKeluargaTable.findFirst({
    where: eq(anggotaKeluargaTable.id, id),
  })
}

export const searchAnggotaKeluargas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.anggotaKeluargaTable.findMany({
    where: (anggotaKeluargas, { ilike }) =>
      ilike(anggotaKeluargas.pendudukId, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countAnggotaKeluargas = async () => {
  const anggotaKeluarga = await db
    .select({ value: count() })
    .from(anggotaKeluargaTable)
  return anggotaKeluarga[0]?.value ?? 0
}
