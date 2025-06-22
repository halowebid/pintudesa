import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  kartuKeluargaTable,
  type InsertKartuKeluarga,
} from "../schema/kartu-keluarga"

export const insertKartuKeluarga = async (data: InsertKartuKeluarga) => {
  const kartuKeluarga = await db
    .insert(kartuKeluargaTable)
    .values(data)
    .returning()

  return kartuKeluarga[0]
}

export const updateKartuKeluarga = async (
  data: InsertKartuKeluarga & { id: string },
) => {
  const kartuKeluarga = await db
    .update(kartuKeluargaTable)
    .set(data)
    .where(eq(kartuKeluargaTable.id, data.id))
    .returning()

  return kartuKeluarga[0]
}

export const deleteKartuKeluarga = async (id: string) => {
  const kartuKeluarga = await db
    .delete(kartuKeluargaTable)
    .where(eq(kartuKeluargaTable.id, id))
    .returning()
  return kartuKeluarga[0]
}

export const getKartuKeluargas = async (page: number, perPage: number) => {
  return await db.query.kartuKeluargaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getKartuKeluargaById = async (id: string) => {
  return await db.query.kartuKeluargaTable.findFirst({
    where: eq(kartuKeluargaTable.id, id),
  })
}

export const searchKartuKeluargas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.kartuKeluargaTable.findMany({
    where: (kartuKeluargas, { ilike }) =>
      ilike(kartuKeluargas.nomorKartuKeluarga, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countKartuKeluargas = async () => {
  const kartuKeluarga = await db
    .select({ value: count() })
    .from(kartuKeluargaTable)
  return kartuKeluarga[0]?.value ?? 0
}
