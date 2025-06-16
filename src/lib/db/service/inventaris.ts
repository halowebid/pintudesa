import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  inventarisTable,
  type InsertInventaris,
} from "@/lib/db/schema/inventaris"

export const insertInventaris = async (data: InsertInventaris) => {
  const inventaris = await db.insert(inventarisTable).values(data).returning()

  return inventaris[0]
}

export const updateInventaris = async (
  data: InsertInventaris & { id: string },
) => {
  const inventaris = await db
    .update(inventarisTable)
    .set(data)
    .where(eq(inventarisTable.id, data.id))
    .returning()

  return inventaris[0]
}

export const deleteInventaris = async (id: string) => {
  const inventaris = await db
    .delete(inventarisTable)
    .where(eq(inventarisTable.id, id))
    .returning()
  return inventaris[0]
}

export const getInventarises = async (page: number, perPage: number) => {
  return await db.query.inventarisTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getInventarisById = async (id: string) => {
  return await db.query.inventarisTable.findFirst({
    where: eq(inventarisTable.id, id),
  })
}

export const searchInventarises = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.inventarisTable.findMany({
    where: (inventarises, { ilike }) =>
      ilike(inventarises.tahun, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countInventarises = async () => {
  const inventaris = await db.select({ value: count() }).from(inventarisTable)
  return inventaris[0]?.value ?? 0
}
