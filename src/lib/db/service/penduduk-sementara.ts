import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  pendudukSementaraTable,
  type InsertPendudukSementara,
} from "@/lib/db/schema/penduduk-sementara"

export const insertPendudukSementara = async (
  data: InsertPendudukSementara,
) => {
  const pendudukSementara = await db
    .insert(pendudukSementaraTable)
    .values(data)
    .returning()

  return pendudukSementara[0]
}

export const updatePendudukSementara = async (
  data: InsertPendudukSementara & { id: string },
) => {
  const pendudukSementara = await db
    .update(pendudukSementaraTable)
    .set(data)
    .where(eq(pendudukSementaraTable.id, data.id))
    .returning()

  return pendudukSementara[0]
}

export const deletePendudukSementara = async (id: string) => {
  const pendudukSementara = await db
    .delete(pendudukSementaraTable)
    .where(eq(pendudukSementaraTable.id, id))
    .returning()
  return pendudukSementara[0]
}

export const getPendudukSementaras = async (page: number, perPage: number) => {
  return await db.query.pendudukSementaraTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getPendudukSementaraById = async (id: string) => {
  return await db.query.pendudukSementaraTable.findFirst({
    where: eq(pendudukSementaraTable.id, id),
  })
}

export const searchPendudukSementaras = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.pendudukSementaraTable.findMany({
    where: (pendudukSementaras, { ilike }) =>
      ilike(pendudukSementaras.nama, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countPendudukSementaras = async () => {
  const pendudukSementara = await db
    .select({ value: count() })
    .from(pendudukSementaraTable)
  return pendudukSementara[0]?.value ?? 0
}
