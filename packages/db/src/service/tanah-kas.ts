import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { tanahKasTable, type InsertTanahKas } from "../schema/tanah-kas"

/**
 * Create a new village treasury land entry
 *
 * @param data - The village treasury land data to insert
 * @returns The created village treasury land entry
 */
export const insertTanahKas = async (data: InsertTanahKas) => {
  const tanahKas = await db.insert(tanahKasTable).values(data).returning()

  return tanahKas[0]
}

/**
 * Update an existing village treasury land entry
 *
 * @param data - The village treasury land data to update, including the id
 * @returns The updated village treasury land entry
 */
export const updateTanahKas = async (data: InsertTanahKas & { id: string }) => {
  const tanahKas = await db
    .update(tanahKasTable)
    .set(data)
    .where(eq(tanahKasTable.id, data.id))
    .returning()

  return tanahKas[0]
}

/**
 * Delete a village treasury land entry by ID
 *
 * @param id - The ID of the village treasury land to delete
 * @returns The deleted village treasury land entry
 */
export const deleteTanahKas = async (id: string) => {
  const tanahKas = await db
    .delete(tanahKasTable)
    .where(eq(tanahKasTable.id, id))
    .returning()
  return tanahKas[0]
}

/**
 * Get paginated list of village treasury lands
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of village treasury lands per page
 * @returns Array of village treasury land entries ordered by creation date
 */
export const getTanahKases = async (page: number, perPage: number) => {
  return await db.query.tanahKasTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single village treasury land by ID
 *
 * @param id - The ID of the village treasury land
 * @returns The village treasury land if found, undefined otherwise
 */
export const getTanahKasById = async (id: string) => {
  return await db.query.tanahKasTable.findFirst({
    where: eq(tanahKasTable.id, id),
  })
}

/**
 * Search village treasury lands by origin with limit
 *
 * @param searchQuery - The search query string to match against origin
 * @param limit - Maximum number of results to return
 * @returns Array of matching village treasury land entries
 */
export const searchTanahKases = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.tanahKasTable.findMany({
    where: (tanahKases, { ilike }) =>
      ilike(tanahKases.asal, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all village treasury lands
 *
 * @returns The total number of village treasury land entries
 */
export const countTanahKases = async () => {
  const tanahKas = await db.select({ value: count() }).from(tanahKasTable)
  return tanahKas[0]?.value ?? 0
}
