import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { tanahTable, type InsertTanah } from "@/lib/db/schema/tanah"

export const insertTanah = async (data: InsertTanah) => {
  const tanah = await db.insert(tanahTable).values(data).returning()

  return tanah[0]
}

export const updateTanah = async (data: InsertTanah & { id: string }) => {
  const tanah = await db
    .update(tanahTable)
    .set(data)
    .where(eq(tanahTable.id, data.id))
    .returning()

  return tanah[0]
}

export const deleteTanah = async (id: string) => {
  const tanah = await db
    .delete(tanahTable)
    .where(eq(tanahTable.id, id))
    .returning()
  return tanah[0]
}

export const getTanahs = async (page: number, perPage: number) => {
  return await db.query.tanahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getTanahById = async (id: string) => {
  return await db.query.tanahTable.findFirst({
    where: eq(tanahTable.id, id),
  })
}

export const searchTanahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.tanahTable.findMany({
    where: (tanahs, { ilike }) =>
      ilike(tanahs.keteranganTambahan, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countTanahs = async () => {
  const tanah = await db.select({ value: count() }).from(tanahTable)
  return tanah[0]?.value ?? 0
}
