import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  rencanaKerjaPembangunanTable,
  type InsertRencanaKerjaPembangunan,
} from "../schema/rencana-kerja-pembangunan"

/**
 * Create a new development work plan entry
 *
 * @param data - The development work plan data to insert
 * @returns The created development work plan entry
 */
export const insertRencanaKerjaPembangunan = async (
  data: InsertRencanaKerjaPembangunan,
) => {
  const rencanaKerjaPembangunan = await db
    .insert(rencanaKerjaPembangunanTable)
    .values(data)
    .returning()

  return rencanaKerjaPembangunan[0]
}

/**
 * Update an existing development work plan entry
 *
 * @param data - The development work plan data to update, including the id
 * @returns The updated development work plan entry
 */
export const updateRencanaKerjaPembangunan = async (
  data: InsertRencanaKerjaPembangunan & { id: string },
) => {
  const rencanaKerjaPembangunan = await db
    .update(rencanaKerjaPembangunanTable)
    .set(data)
    .where(eq(rencanaKerjaPembangunanTable.id, data.id))
    .returning()

  return rencanaKerjaPembangunan[0]
}

/**
 * Delete a development work plan entry by ID
 *
 * @param id - The ID of the development work plan to delete
 * @returns The deleted development work plan entry
 */
export const deleteRencanaKerjaPembangunan = async (id: string) => {
  const rencanaKerjaPembangunan = await db
    .delete(rencanaKerjaPembangunanTable)
    .where(eq(rencanaKerjaPembangunanTable.id, id))
    .returning()
  return rencanaKerjaPembangunan[0]
}

/**
 * Get paginated list of development work plans
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of development work plans per page
 * @returns Array of development work plan entries ordered by creation date
 */
export const getRencanaKerjaPembangunans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.rencanaKerjaPembangunanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single development work plan by ID
 *
 * @param id - The ID of the development work plan
 * @returns The development work plan if found, undefined otherwise
 */
export const getRencanaKerjaPembangunanById = async (id: string) => {
  return await db.query.rencanaKerjaPembangunanTable.findFirst({
    where: eq(rencanaKerjaPembangunanTable.id, id),
  })
}

/**
 * Search development work plans by activity name with limit
 *
 * @param searchQuery - The search query string to match against activity name
 * @param limit - Maximum number of results to return
 * @returns Array of matching development work plan entries
 */
export const searchRencanaKerjaPembangunans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.rencanaKerjaPembangunanTable.findMany({
    where: (rencanaKerjaPembangunans, { ilike }) =>
      ilike(rencanaKerjaPembangunans.namaKegiatan, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all development work plans
 *
 * @returns The total number of development work plan entries
 */
export const countRencanaKerjaPembangunans = async () => {
  const rencanaKerjaPembangunan = await db
    .select({ value: count() })
    .from(rencanaKerjaPembangunanTable)
  return rencanaKerjaPembangunan[0]?.value ?? 0
}
