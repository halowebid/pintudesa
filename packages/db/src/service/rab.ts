import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { rabTable, type InsertRAB } from "../schema/rab"

/**
 * Create a new budget plan (RAB) entry
 *
 * @param data - The budget plan data to insert
 * @returns The created budget plan entry
 */
export const insertRAB = async (data: InsertRAB) => {
  const rab = await db.insert(rabTable).values(data).returning()

  return rab[0]
}

/**
 * Update an existing budget plan (RAB) entry
 *
 * @param data - The budget plan data to update, including the id
 * @returns The updated budget plan entry
 */
export const updateRAB = async (data: InsertRAB & { id: string }) => {
  const rab = await db
    .update(rabTable)
    .set(data)
    .where(eq(rabTable.id, data.id))
    .returning()

  return rab[0]
}

/**
 * Delete a budget plan (RAB) entry by ID
 *
 * @param id - The ID of the budget plan to delete
 * @returns The deleted budget plan entry
 */
export const deleteRAB = async (id: string) => {
  const rab = await db.delete(rabTable).where(eq(rabTable.id, id)).returning()
  return rab[0]
}

/**
 * Get paginated list of budget plans (RAB)
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of budget plans per page
 * @returns Array of budget plan entries ordered by creation date
 */
export const getRABs = async (page: number, perPage: number) => {
  return await db.query.rabTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single budget plan (RAB) by ID
 *
 * @param id - The ID of the budget plan
 * @returns The budget plan if found, undefined otherwise
 */
export const getRABById = async (id: string) => {
  return await db.query.rabTable.findFirst({
    where: eq(rabTable.id, id),
  })
}

/**
 * Search budget plans (RAB) by field with limit
 *
 * @param searchQuery - The search query string to match against field
 * @param limit - Maximum number of results to return
 * @returns Array of matching budget plan entries
 */
export const searchRABs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.rabTable.findMany({
    where: (rabs, { ilike }) => ilike(rabs.bidang, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all budget plans (RAB)
 *
 * @returns The total number of budget plan entries
 */
export const countRABs = async () => {
  const rab = await db.select({ value: count() }).from(rabTable)
  return rab[0]?.value ?? 0
}
