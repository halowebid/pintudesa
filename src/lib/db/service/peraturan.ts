import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { peraturanTable, type InsertPeraturan } from "../schema/peraturan"

/**
 * Create a new regulation entry
 *
 * @param data - The regulation data to insert
 * @returns The created regulation entry
 */
export const insertPeraturan = async (data: InsertPeraturan) => {
  const peraturan = await db.insert(peraturanTable).values(data).returning()

  return peraturan[0]
}

/**
 * Update an existing regulation entry
 *
 * @param data - The regulation data to update, including the id
 * @returns The updated regulation entry
 */
export const updatePeraturan = async (
  data: InsertPeraturan & { id: string },
) => {
  const peraturan = await db
    .update(peraturanTable)
    .set(data)
    .where(eq(peraturanTable.id, data.id))
    .returning()

  return peraturan[0]
}

/**
 * Delete a regulation entry by ID
 *
 * @param id - The ID of the regulation to delete
 * @returns The deleted regulation entry
 */
export const deletePeraturan = async (id: string) => {
  const peraturan = await db
    .delete(peraturanTable)
    .where(eq(peraturanTable.id, id))
    .returning()
  return peraturan[0]
}

/**
 * Get paginated list of regulations
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of regulations per page
 * @returns Array of regulation entries ordered by creation date
 */
export const getPeraturans = async (page: number, perPage: number) => {
  return await db.query.peraturanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single regulation by ID
 *
 * @param id - The ID of the regulation
 * @returns The regulation if found, undefined otherwise
 */
export const getPeraturanById = async (id: string) => {
  return await db.query.peraturanTable.findFirst({
    where: eq(peraturanTable.id, id),
  })
}

/**
 * Search regulations by title with limit
 *
 * @param searchQuery - The search query string to match against title
 * @param limit - Maximum number of results to return
 * @returns Array of matching regulation entries
 */
export const searchPeraturans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.peraturanTable.findMany({
    where: (peraturans, { ilike }) =>
      ilike(peraturans.judul, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all regulations
 *
 * @returns The total number of regulation entries
 */
export const countPeraturans = async () => {
  const peraturan = await db.select({ value: count() }).from(peraturanTable)
  return peraturan[0]?.value ?? 0
}
