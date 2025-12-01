import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { ekspedisiTable, type InsertEkspedisi } from "../schema/ekspedisi"

/**
 * Create a new expedition entry
 *
 * @param data - The expedition data to insert
 * @returns The created expedition entry
 */
export const insertEkspedisi = async (data: InsertEkspedisi) => {
  const ekspedisi = await db.insert(ekspedisiTable).values(data).returning()

  return ekspedisi[0]
}

/**
 * Update an existing expedition entry
 *
 * @param data - The expedition data to update, including the id
 * @returns The updated expedition entry
 */
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

/**
 * Delete an expedition entry by ID
 *
 * @param id - The ID of the expedition to delete
 * @returns The deleted expedition entry
 */
export const deleteEkspedisi = async (id: string) => {
  const ekspedisi = await db
    .delete(ekspedisiTable)
    .where(eq(ekspedisiTable.id, id))
    .returning()
  return ekspedisi[0]
}

/**
 * Get paginated list of expeditions
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of expeditions per page
 * @returns Array of expedition entries ordered by creation date
 */
export const getEkspedises = async (page: number, perPage: number) => {
  return await db.query.ekspedisiTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single expedition by ID
 *
 * @param id - The ID of the expedition
 * @returns The expedition if found, undefined otherwise
 */
export const getEkspedisiById = async (id: string) => {
  return await db.query.ekspedisiTable.findFirst({
    where: eq(ekspedisiTable.id, id),
  })
}

/**
 * Search expeditions by letter number with limit
 *
 * @param searchQuery - The search query string to match against letter number
 * @param limit - Maximum number of results to return
 * @returns Array of matching expedition entries
 */
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

/**
 * Get total count of all expeditions
 *
 * @returns The total number of expedition entries
 */
export const countEkspedises = async () => {
  const ekspedisi = await db.select({ value: count() }).from(ekspedisiTable)
  return ekspedisi[0]?.value ?? 0
}
