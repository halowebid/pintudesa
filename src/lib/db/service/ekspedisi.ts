import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { ekspedisiTable, type InsertEkspedisi } from "@/lib/db/schema/ekspedisi"

export const insertEkspedisi = async (data: InsertEkspedisi) => {
  const ekspedisi = await db.insert(ekspedisiTable).values(data).returning()

  return ekspedisi[0]
}

export const updateEkspedisi = async (
  data: InsertEkspedisi & { id: string },
) => {
  const ekspedisi = await db
    .update(ekspedisiTable)
    .set(data)
    .where(eq(ekspedisiTable.id, data.id))
    .returning()

  return ekspedisi[0]
}

export const deleteEkspedisi = async (id: string) => {
  const ekspedisi = await db
    .delete(ekspedisiTable)
    .where(eq(ekspedisiTable.id, id))
    .returning()
  return ekspedisi[0]
}

export const getEkspedises = async (page: number, perPage: number) => {
  return await db.query.ekspedisiTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getEkspedisiById = async (id: string) => {
  return await db.query.ekspedisiTable.findFirst({
    where: eq(ekspedisiTable.id, id),
  })
}

export const searchEkspedises = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.ekspedisiTable.findMany({
    where: (ekspedises, { ilike }) =>
      ilike(ekspedises.nomorSurat, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countEkspedises = async () => {
  const ekspedisi = await db.select({ value: count() }).from(ekspedisiTable)
  return ekspedisi[0]?.value ?? 0
}
