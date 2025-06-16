import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { lembaranTable, type InsertLembaran } from "@/lib/db/schema/lembaran"

export const insertLembaran = async (data: InsertLembaran) => {
  const lembaran = await db.insert(lembaranTable).values(data).returning()

  return lembaran[0]
}

export const updateLembaran = async (data: InsertLembaran & { id: string }) => {
  const lembaran = await db
    .update(lembaranTable)
    .set(data)
    .where(eq(lembaranTable.id, data.id))
    .returning()

  return lembaran[0]
}

export const deleteLembaran = async (id: string) => {
  const lembaran = await db
    .delete(lembaranTable)
    .where(eq(lembaranTable.id, id))
    .returning()
  return lembaran[0]
}

export const getLembarans = async (page: number, perPage: number) => {
  return await db.query.lembaranTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getLembaranById = async (id: string) => {
  return await db.query.lembaranTable.findFirst({
    where: eq(lembaranTable.id, id),
  })
}

export const searchLembarans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.lembaranTable.findMany({
    where: (lembarans, { ilike }) =>
      ilike(lembarans.nomorDitetapkan, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countLembarans = async () => {
  const lembaran = await db.select({ value: count() }).from(lembaranTable)
  return lembaran[0]?.value ?? 0
}
