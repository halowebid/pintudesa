import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  inventarisHasilPembangunanTable,
  type InsertInventarisHasilPembangunan,
} from "../schema/inventaris-hasil-pembangunan"

/**
 * Create a new development result inventory entry
 *
 * @param data - The development result inventory data to insert
 * @returns The created development result inventory entry
 */
export const insertInventarisHasilPembangunan = async (
  data: InsertInventarisHasilPembangunan,
) => {
  const inventarisHasilPembangunan = await db
    .insert(inventarisHasilPembangunanTable)
    .values(data)
    .returning()

  return inventarisHasilPembangunan[0]
}

/**
 * Update an existing development result inventory entry
 *
 * @param data - The development result inventory data to update, including the id
 * @returns The updated development result inventory entry
 */
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

/**
 * Delete a development result inventory entry by ID
 *
 * @param id - The ID of the development result inventory to delete
 * @returns The deleted development result inventory entry
 */
export const deleteInventarisHasilPembangunan = async (id: string) => {
  const inventarisHasilPembangunan = await db
    .delete(inventarisHasilPembangunanTable)
    .where(eq(inventarisHasilPembangunanTable.id, id))
    .returning()
  return inventarisHasilPembangunan[0]
}

/**
 * Get paginated list of development result inventories
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of development result inventories per page
 * @returns Array of development result inventory entries ordered by creation date
 */
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

/**
 * Get a single development result inventory by ID
 *
 * @param id - The ID of the development result inventory
 * @returns The development result inventory if found, undefined otherwise
 */
export const getInventarisHasilPembangunanById = async (id: string) => {
  return await db.query.inventarisHasilPembangunanTable.findFirst({
    where: eq(inventarisHasilPembangunanTable.id, id),
  })
}

/**
 * Search development result inventories by development name with limit
 *
 * @param searchQuery - The search query string to match against development name
 * @param limit - Maximum number of results to return
 * @returns Array of matching development result inventory entries
 */
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

/**
 * Get total count of all development result inventories
 *
 * @returns The total number of development result inventory entries
 */
export const countInventarisHasilPembangunans = async () => {
  const inventarisHasilPembangunan = await db
    .select({ value: count() })
    .from(inventarisHasilPembangunanTable)
  return inventarisHasilPembangunan[0]?.value ?? 0
}
