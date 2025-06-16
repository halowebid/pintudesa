import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { tanahKasTable, type InsertTanahKas } from "@/lib/db/schema/tanah-kas"

export const insertTanahKas = async (data: InsertTanahKas) => {
  const tanahKas = await db.insert(tanahKasTable).values(data).returning()

  return tanahKas[0]
}

export const updateTanahKas = async (data: InsertTanahKas & { id: string }) => {
  const tanahKas = await db
    .update(tanahKasTable)
    .set(data)
    .where(eq(tanahKasTable.id, data.id))
    .returning()

  return tanahKas[0]
}

export const deleteTanahKas = async (id: string) => {
  const tanahKas = await db
    .delete(tanahKasTable)
    .where(eq(tanahKasTable.id, id))
    .returning()
  return tanahKas[0]
}

export const getTanahKases = async (page: number, perPage: number) => {
  return await db.query.tanahKasTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getTanahKasById = async (id: string) => {
  return await db.query.tanahKasTable.findFirst({
    where: eq(tanahKasTable.id, id),
  })
}

export const searchTanahKases = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.tanahKasTable.findMany({
    where: (tanahKases, { ilike }) =>
      ilike(tanahKases.asal, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countTanahKases = async () => {
  const tanahKas = await db.select({ value: count() }).from(tanahKasTable)
  return tanahKas[0]?.value ?? 0
}
