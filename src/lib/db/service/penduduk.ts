import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { pendudukTable, type InsertPenduduk } from "@/lib/db/schema/penduduk"

export const insertPenduduk = async (data: InsertPenduduk) => {
  const penduduk = await db.insert(pendudukTable).values(data).returning()

  return penduduk[0]
}

export const updatePenduduk = async (data: InsertPenduduk & { id: string }) => {
  const penduduk = await db
    .update(pendudukTable)
    .set(data)
    .where(eq(pendudukTable.id, data.id))
    .returning()

  return penduduk[0]
}

export const deletePenduduk = async (id: string) => {
  const penduduk = await db
    .delete(pendudukTable)
    .where(eq(pendudukTable.id, id))
    .returning()
  return penduduk[0]
}

export const getPenduduks = async (page: number, perPage: number) => {
  return await db.query.pendudukTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getPendudukById = async (id: string) => {
  return await db.query.pendudukTable.findFirst({
    where: eq(pendudukTable.id, id),
  })
}

export const searchPenduduks = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.pendudukTable.findMany({
    where: (penduduks, { ilike }) =>
      ilike(penduduks.namaLengkap, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countPenduduks = async () => {
  const penduduk = await db.select({ value: count() }).from(pendudukTable)
  return penduduk[0]?.value ?? 0
}
