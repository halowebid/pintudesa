import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { tanahTable, type InsertTanah } from "../schema/tanah"

/**
 * Create a new land entry
 *
 * @param data - The land data to insert
 * @returns The created land entry
 */
export const insertTanah = async (data: InsertTanah) => {
  const tanah = await db.insert(tanahTable).values(data).returning()

  return tanah[0]
}

/**
 * Update an existing land entry
 *
 * @param data - The land data to update, including the id
 * @returns The updated land entry
 */
export const updateTanah = async (data: InsertTanah & { id: string }) => {
  const tanah = await db
    .update(tanahTable)
    .set(data)
    .where(eq(tanahTable.id, data.id))
    .returning()

  return tanah[0]
}

/**
 * Delete a land entry by ID
 *
 * @param id - The ID of the land to delete
 * @returns The deleted land entry
 */
export const deleteTanah = async (id: string) => {
  const tanah = await db
    .delete(tanahTable)
    .where(eq(tanahTable.id, id))
    .returning()
  return tanah[0]
}

/**
 * Get paginated list of lands
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of lands per page
 * @returns Array of land entries ordered by creation date
 */
export const getTanahs = async (page: number, perPage: number) => {
  return await db.query.tanahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single land by ID
 *
 * @param id - The ID of the land
 * @returns The land if found, undefined otherwise
 */
export const getTanahById = async (id: string) => {
  return await db.query.tanahTable.findFirst({
    where: eq(tanahTable.id, id),
  })
}

/**
 * Search lands by additional notes with limit
 *
 * @param searchQuery - The search query string to match against additional notes
 * @param limit - Maximum number of results to return
 * @returns Array of matching land entries
 */
export const searchTanahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.tanahTable.findMany({
    where: (tanahs, { ilike }) =>
      ilike(tanahs.keteranganTambahan, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all lands
 *
 * @returns The total number of land entries
 */
export const countTanahs = async () => {
  const tanah = await db.select({ value: count() }).from(tanahTable)
  return tanah[0]?.value ?? 0
}
