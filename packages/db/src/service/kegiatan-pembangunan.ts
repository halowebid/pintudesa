import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  kegiatanPembangunanTable,
  type InsertKegiatanPembangunan,
} from "../schema/kegiatan-pembangunan"

/**
 * Create a new development activity entry
 *
 * @param data - The development activity data to insert
 * @returns The created development activity entry
 */
export const insertKegiatanPembangunan = async (
  data: InsertKegiatanPembangunan,
) => {
  const kegiatanPembangunan = await db
    .insert(kegiatanPembangunanTable)
    .values(data)
    .returning()

  return kegiatanPembangunan[0]
}

/**
 * Update an existing development activity entry
 *
 * @param data - The development activity data to update, including the id
 * @returns The updated development activity entry
 */
export const updateKegiatanPembangunan = async (
  data: InsertKegiatanPembangunan & { id: string },
) => {
  const kegiatanPembangunan = await db
    .update(kegiatanPembangunanTable)
    .set(data)
    .where(eq(kegiatanPembangunanTable.id, data.id))
    .returning()

  return kegiatanPembangunan[0]
}

/**
 * Delete a development activity entry by ID
 *
 * @param id - The ID of the development activity to delete
 * @returns The deleted development activity entry
 */
export const deleteKegiatanPembangunan = async (id: string) => {
  const kegiatanPembangunan = await db
    .delete(kegiatanPembangunanTable)
    .where(eq(kegiatanPembangunanTable.id, id))
    .returning()
  return kegiatanPembangunan[0]
}

/**
 * Get paginated list of development activities
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of development activities per page
 * @returns Array of development activity entries ordered by creation date
 */
export const getKegiatanPembangunans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.kegiatanPembangunanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single development activity by ID
 *
 * @param id - The ID of the development activity
 * @returns The development activity if found, undefined otherwise
 */
export const getKegiatanPembangunanById = async (id: string) => {
  return await db.query.kegiatanPembangunanTable.findFirst({
    where: eq(kegiatanPembangunanTable.id, id),
  })
}

/**
 * Search development activities by activity name with limit
 *
 * @param searchQuery - The search query string to match against activity name
 * @param limit - Maximum number of results to return
 * @returns Array of matching development activity entries
 */
export const searchKegiatanPembangunans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.kegiatanPembangunanTable.findMany({
    where: (kegiatanPembangunans, { ilike }) =>
      ilike(kegiatanPembangunans.namaKegiatan, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all development activities
 *
 * @returns The total number of development activity entries
 */
export const countKegiatanPembangunans = async () => {
  const kegiatanPembangunan = await db
    .select({ value: count() })
    .from(kegiatanPembangunanTable)
  return kegiatanPembangunan[0]?.value ?? 0
}
