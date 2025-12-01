import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { lembaranTable, type InsertLembaran } from "../schema/lembaran"

/**
 * Create a new sheet entry
 *
 * @param data - The sheet data to insert
 * @returns The created sheet entry
 */
export const insertLembaran = async (data: InsertLembaran) => {
  const lembaran = await db.insert(lembaranTable).values(data).returning()

  return lembaran[0]
}

/**
 * Update an existing sheet entry
 *
 * @param data - The sheet data to update, including the id
 * @returns The updated sheet entry
 */
export const updateLembaran = async (data: InsertLembaran & { id: string }) => {
  const lembaran = await db
    .update(lembaranTable)
    .set(data)
    .where(eq(lembaranTable.id, data.id))
    .returning()

  return lembaran[0]
}

/**
 * Delete a sheet entry by ID
 *
 * @param id - The ID of the sheet to delete
 * @returns The deleted sheet entry
 */
export const deleteLembaran = async (id: string) => {
  const lembaran = await db
    .delete(lembaranTable)
    .where(eq(lembaranTable.id, id))
    .returning()
  return lembaran[0]
}

/**
 * Get paginated list of sheets
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of sheets per page
 * @returns Array of sheet entries ordered by creation date
 */
export const getLembarans = async (page: number, perPage: number) => {
  return await db.query.lembaranTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single sheet by ID
 *
 * @param id - The ID of the sheet
 * @returns The sheet if found, undefined otherwise
 */
export const getLembaranById = async (id: string) => {
  return await db.query.lembaranTable.findFirst({
    where: eq(lembaranTable.id, id),
  })
}

/**
 * Search sheets by decree number with limit
 *
 * @param searchQuery - The search query string to match against decree number
 * @param limit - Maximum number of results to return
 * @returns Array of matching sheet entries
 */
export const searchLembarans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.lembaranTable.findMany({
    where: (lembarans, { ilike }) =>
      ilike(lembarans.nomorDitetapkan, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all sheets
 *
 * @returns The total number of sheet entries
 */
export const countLembarans = async () => {
  const lembaran = await db.select({ value: count() }).from(lembaranTable)
  return lembaran[0]?.value ?? 0
}
