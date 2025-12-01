import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { inventarisTable, type InsertInventaris } from "../schema/inventaris"

/**
 * Create a new inventory entry
 *
 * @param data - The inventory data to insert
 * @returns The created inventory entry
 */
export const insertInventaris = async (data: InsertInventaris) => {
  const inventaris = await db.insert(inventarisTable).values(data).returning()

  return inventaris[0]
}

/**
 * Update an existing inventory entry
 *
 * @param data - The inventory data to update, including the id
 * @returns The updated inventory entry
 */
export const updateInventaris = async (
  data: InsertInventaris & { id: string },
) => {
  const inventaris = await db
    .update(inventarisTable)
    .set(data)
    .where(eq(inventarisTable.id, data.id))
    .returning()

  return inventaris[0]
}

/**
 * Delete an inventory entry by ID
 *
 * @param id - The ID of the inventory to delete
 * @returns The deleted inventory entry
 */
export const deleteInventaris = async (id: string) => {
  const inventaris = await db
    .delete(inventarisTable)
    .where(eq(inventarisTable.id, id))
    .returning()
  return inventaris[0]
}

/**
 * Get paginated list of inventories
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of inventories per page
 * @returns Array of inventory entries ordered by creation date
 */
export const getInventarises = async (page: number, perPage: number) => {
  return await db.query.inventarisTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single inventory by ID
 *
 * @param id - The ID of the inventory
 * @returns The inventory if found, undefined otherwise
 */
export const getInventarisById = async (id: string) => {
  return await db.query.inventarisTable.findFirst({
    where: eq(inventarisTable.id, id),
  })
}

/**
 * Search inventories by year with limit
 *
 * @param searchQuery - The search query string to match against year
 * @param limit - Maximum number of results to return
 * @returns Array of matching inventory entries
 */
export const searchInventarises = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.inventarisTable.findMany({
    where: (inventarises, { ilike }) =>
      ilike(inventarises.tahun, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all inventories
 *
 * @returns The total number of inventory entries
 */
export const countInventarises = async () => {
  const inventaris = await db.select({ value: count() }).from(inventarisTable)
  return inventaris[0]?.value ?? 0
}
