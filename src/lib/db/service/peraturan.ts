import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { peraturanTable, type InsertPeraturan } from "@/lib/db/schema/peraturan"

export const insertPeraturan = async (data: InsertPeraturan) => {
  const peraturan = await db.insert(peraturanTable).values(data).returning()

  return peraturan[0]
}

export const updatePeraturan = async (
  data: InsertPeraturan & { id: string },
) => {
  const peraturan = await db
    .update(peraturanTable)
    .set(data)
    .where(eq(peraturanTable.id, data.id))
    .returning()

  return peraturan[0]
}

export const deletePeraturan = async (id: string) => {
  const peraturan = await db
    .delete(peraturanTable)
    .where(eq(peraturanTable.id, id))
    .returning()
  return peraturan[0]
}

export const getPeraturans = async (page: number, perPage: number) => {
  return await db.query.peraturanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getPeraturanById = async (id: string) => {
  return await db.query.peraturanTable.findFirst({
    where: eq(peraturanTable.id, id),
  })
}

export const searchPeraturans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.peraturanTable.findMany({
    where: (peraturans, { ilike }) =>
      ilike(peraturans.judul, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countPeraturans = async () => {
  const peraturan = await db.select({ value: count() }).from(peraturanTable)
  return peraturan[0]?.value ?? 0
}
