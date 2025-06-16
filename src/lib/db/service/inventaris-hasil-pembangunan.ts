import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  inventarisHasilPembangunanTable,
  type InsertInventarisHasilPembangunan,
} from "@/lib/db/schema/inventaris-hasil-pembangunan"

export const insertInventarisHasilPembangunan = async (
  data: InsertInventarisHasilPembangunan,
) => {
  const inventarisHasilPembangunan = await db
    .insert(inventarisHasilPembangunanTable)
    .values(data)
    .returning()

  return inventarisHasilPembangunan[0]
}

export const updateInventarisHasilPembangunan = async (
  data: InsertInventarisHasilPembangunan & { id: string },
) => {
  const inventarisHasilPembangunan = await db
    .update(inventarisHasilPembangunanTable)
    .set(data)
    .where(eq(inventarisHasilPembangunanTable.id, data.id))
    .returning()

  return inventarisHasilPembangunan[0]
}

export const deleteInventarisHasilPembangunan = async (id: string) => {
  const inventarisHasilPembangunan = await db
    .delete(inventarisHasilPembangunanTable)
    .where(eq(inventarisHasilPembangunanTable.id, id))
    .returning()
  return inventarisHasilPembangunan[0]
}

export const getInventarisHasilPembangunans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.inventarisHasilPembangunanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getInventarisHasilPembangunanById = async (id: string) => {
  return await db.query.inventarisHasilPembangunanTable.findFirst({
    where: eq(inventarisHasilPembangunanTable.id, id),
  })
}

export const searchInventarisHasilPembangunans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.inventarisHasilPembangunanTable.findMany({
    where: (inventarisHasilPembangunans, { ilike }) =>
      ilike(
        inventarisHasilPembangunans.namaHasilPembangunan,
        `%${searchQuery}%`,
      ),
    limit: limit,
  })
}

export const countInventarisHasilPembangunans = async () => {
  const inventarisHasilPembangunan = await db
    .select({ value: count() })
    .from(inventarisHasilPembangunanTable)
  return inventarisHasilPembangunan[0]?.value ?? 0
}
