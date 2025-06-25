import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  keputusanKepalaDesaTable,
  type InsertKeputusanKepalaDesa,
} from "../schema/keputusan-kepala-desa"

export const insertKeputusanKepalaDesa = async (
  data: InsertKeputusanKepalaDesa,
) => {
  const keputusanKepalaDesa = await db
    .insert(keputusanKepalaDesaTable)
    .values(data)
    .returning()

  return keputusanKepalaDesa[0]
}

export const updateKeputusanKepalaDesa = async (
  data: InsertKeputusanKepalaDesa & { id: string },
) => {
  const keputusanKepalaDesa = await db
    .update(keputusanKepalaDesaTable)
    .set(data)
    .where(eq(keputusanKepalaDesaTable.id, data.id))
    .returning()

  return keputusanKepalaDesa[0]
}

export const deleteKeputusanKepalaDesa = async (id: string) => {
  const keputusanKepalaDesa = await db
    .delete(keputusanKepalaDesaTable)
    .where(eq(keputusanKepalaDesaTable.id, id))
    .returning()
  return keputusanKepalaDesa[0]
}

export const getKeputusanKepalaDesas = async (
  page: number,
  perPage: number,
) => {
  return await db.query.keputusanKepalaDesaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getKeputusanKepalaDesaById = async (id: string) => {
  return await db.query.keputusanKepalaDesaTable.findFirst({
    where: eq(keputusanKepalaDesaTable.id, id),
  })
}

export const searchKeputusanKepalaDesas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.keputusanKepalaDesaTable.findMany({
    where: (keputusanKepalaDesas, { ilike }) =>
      ilike(keputusanKepalaDesas.judul, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countKeputusanKepalaDesas = async () => {
  const keputusanKepalaDesa = await db
    .select({ value: count() })
    .from(keputusanKepalaDesaTable)
  return keputusanKepalaDesa[0]?.value ?? 0
}
