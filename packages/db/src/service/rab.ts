import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { rabTable, type InsertRAB } from "../schema/rab"

export const insertRAB = async (data: InsertRAB) => {
  const rab = await db.insert(rabTable).values(data).returning()

  return rab[0]
}

export const updateRAB = async (data: InsertRAB & { id: string }) => {
  const rab = await db
    .update(rabTable)
    .set(data)
    .where(eq(rabTable.id, data.id))
    .returning()

  return rab[0]
}

export const deleteRAB = async (id: string) => {
  const rab = await db.delete(rabTable).where(eq(rabTable.id, id)).returning()
  return rab[0]
}

export const getRABs = async (page: number, perPage: number) => {
  return await db.query.rabTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getRABById = async (id: string) => {
  return await db.query.rabTable.findFirst({
    where: eq(rabTable.id, id),
  })
}

export const searchRABs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.rabTable.findMany({
    where: (rabs, { ilike }) => ilike(rabs.bidang, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countRABs = async () => {
  const rab = await db.select({ value: count() }).from(rabTable)
  return rab[0]?.value ?? 0
}
