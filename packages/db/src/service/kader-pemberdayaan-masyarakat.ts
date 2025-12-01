import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  kaderPemberdayaanMasyarakatTable,
  type InsertKaderPemberdayaanMasyarakat,
} from "../schema/kader-pemberdayaan-masyarakat"

/**
 * Create a new community empowerment cadre entry
 *
 * @param data - The community empowerment cadre data to insert
 * @returns The created community empowerment cadre entry
 */
export const insertKaderPemberdayaanMasyarakat = async (
  data: InsertKaderPemberdayaanMasyarakat,
) => {
  const kaderPemberdayaanMasyarakat = await db
    .insert(kaderPemberdayaanMasyarakatTable)
    .values(data)
    .returning()

  return kaderPemberdayaanMasyarakat[0]
}

/**
 * Update an existing community empowerment cadre entry
 *
 * @param data - The community empowerment cadre data to update, including the id
 * @returns The updated community empowerment cadre entry
 */
export const updateKaderPemberdayaanMasyarakat = async (
  data: InsertKaderPemberdayaanMasyarakat & { id: string },
) => {
  const kaderPemberdayaanMasyarakat = await db
    .update(kaderPemberdayaanMasyarakatTable)
    .set(data)
    .where(eq(kaderPemberdayaanMasyarakatTable.id, data.id))
    .returning()

  return kaderPemberdayaanMasyarakat[0]
}

/**
 * Delete a community empowerment cadre entry by ID
 *
 * @param id - The ID of the community empowerment cadre to delete
 * @returns The deleted community empowerment cadre entry
 */
export const deleteKaderPemberdayaanMasyarakat = async (id: string) => {
  const kaderPemberdayaanMasyarakat = await db
    .delete(kaderPemberdayaanMasyarakatTable)
    .where(eq(kaderPemberdayaanMasyarakatTable.id, id))
    .returning()
  return kaderPemberdayaanMasyarakat[0]
}

/**
 * Get paginated list of community empowerment cadres
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of community empowerment cadres per page
 * @returns Array of community empowerment cadre entries ordered by creation date
 */
export const getKaderPemberdayaanMasyarakats = async (
  page: number,
  perPage: number,
) => {
  return await db.query.kaderPemberdayaanMasyarakatTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single community empowerment cadre by ID
 *
 * @param id - The ID of the community empowerment cadre
 * @returns The community empowerment cadre if found, undefined otherwise
 */
export const getKaderPemberdayaanMasyarakatById = async (id: string) => {
  return await db.query.kaderPemberdayaanMasyarakatTable.findFirst({
    where: eq(kaderPemberdayaanMasyarakatTable.id, id),
  })
}

/**
 * Search community empowerment cadres by name with limit
 *
 * @param searchQuery - The search query string to match against name
 * @param limit - Maximum number of results to return
 * @returns Array of matching community empowerment cadre entries
 */
export const searchKaderPemberdayaanMasyarakats = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.kaderPemberdayaanMasyarakatTable.findMany({
    where: (kaderPemberdayaanMasyarakats, { ilike }) =>
      ilike(kaderPemberdayaanMasyarakats.nama, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all community empowerment cadres
 *
 * @returns The total number of community empowerment cadre entries
 */
export const countKaderPemberdayaanMasyarakats = async () => {
  const kaderPemberdayaanMasyarakat = await db
    .select({ value: count() })
    .from(kaderPemberdayaanMasyarakatTable)
  return kaderPemberdayaanMasyarakat[0]?.value ?? 0
}
