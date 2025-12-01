import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  keputusanKepalaDesaTable,
  type InsertKeputusanKepalaDesa,
} from "../schema/keputusan-kepala-desa"

/**
 * Create a new village head decision entry
 *
 * @param data - The village head decision data to insert
 * @returns The created village head decision entry
 */
export const insertKeputusanKepalaDesa = async (
  data: InsertKeputusanKepalaDesa,
) => {
  const keputusanKepalaDesa = await db
    .insert(keputusanKepalaDesaTable)
    .values(data)
    .returning()

  return keputusanKepalaDesa[0]
}

/**
 * Update an existing village head decision entry
 *
 * @param data - The village head decision data to update, including the id
 * @returns The updated village head decision entry
 */
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

/**
 * Delete a village head decision entry by ID
 *
 * @param id - The ID of the village head decision to delete
 * @returns The deleted village head decision entry
 */
export const deleteKeputusanKepalaDesa = async (id: string) => {
  const keputusanKepalaDesa = await db
    .delete(keputusanKepalaDesaTable)
    .where(eq(keputusanKepalaDesaTable.id, id))
    .returning()
  return keputusanKepalaDesa[0]
}

/**
 * Get paginated list of village head decisions
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of village head decisions per page
 * @returns Array of village head decision entries ordered by creation date
 */
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

/**
 * Get a single village head decision by ID
 *
 * @param id - The ID of the village head decision
 * @returns The village head decision if found, undefined otherwise
 */
export const getKeputusanKepalaDesaById = async (id: string) => {
  return await db.query.keputusanKepalaDesaTable.findFirst({
    where: eq(keputusanKepalaDesaTable.id, id),
  })
}

/**
 * Search village head decisions by title with limit
 *
 * @param searchQuery - The search query string to match against title
 * @param limit - Maximum number of results to return
 * @returns Array of matching village head decision entries
 */
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

/**
 * Get total count of all village head decisions
 *
 * @returns The total number of village head decision entries
 */
export const countKeputusanKepalaDesas = async () => {
  const keputusanKepalaDesa = await db
    .select({ value: count() })
    .from(keputusanKepalaDesaTable)
  return keputusanKepalaDesa[0]?.value ?? 0
}
