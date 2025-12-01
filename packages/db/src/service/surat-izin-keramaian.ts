import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratIzinKeramaianTable,
  type InsertSuratIzinKeramaian,
} from "../schema/surat-izin-keramaian"

/**
 * Create a new crowd gathering permit letter
 *
 * @param data - The crowd gathering permit letter data to insert
 * @returns The created crowd gathering permit letter entry
 */
export const insertSuratIzinKeramaian = async (
  data: InsertSuratIzinKeramaian,
) => {
  const suratIzinKeramaian = await db
    .insert(suratIzinKeramaianTable)
    .values(data)
    .returning()

  return suratIzinKeramaian[0]
}

/**
 * Update an existing crowd gathering permit letter
 *
 * @param data - The crowd gathering permit letter data to update, including the id
 * @returns The updated crowd gathering permit letter entry
 */
export const updateSuratIzinKeramaian = async (
  data: InsertSuratIzinKeramaian & { id: string },
) => {
  const suratIzinKeramaian = await db
    .update(suratIzinKeramaianTable)
    .set(data)
    .where(eq(suratIzinKeramaianTable.id, data.id))
    .returning()

  return suratIzinKeramaian[0]
}

/**
 * Delete a crowd gathering permit letter by ID
 *
 * @param id - The ID of the crowd gathering permit letter to delete
 * @returns The deleted crowd gathering permit letter entry
 */
export const deleteSuratIzinKeramaian = async (id: string) => {
  const suratIzinKeramaian = await db
    .delete(suratIzinKeramaianTable)
    .where(eq(suratIzinKeramaianTable.id, id))
    .returning()
  return suratIzinKeramaian[0]
}

/**
 * Get paginated list of crowd gathering permit letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of crowd gathering permit letters per page
 * @returns Array of crowd gathering permit letter entries with applicant, ordered by creation date
 */
export const getSuratIzinKeramaians = async (page: number, perPage: number) => {
  return await db.query.suratIzinKeramaianTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single crowd gathering permit letter by ID with applicant data
 *
 * @param id - The ID of the crowd gathering permit letter
 * @returns The crowd gathering permit letter with applicant if found, undefined otherwise
 */
export const getSuratIzinKeramaianById = async (id: string) => {
  return await db.query.suratIzinKeramaianTable.findFirst({
    where: eq(suratIzinKeramaianTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search crowd gathering permit letters by applicant NIK with limit
 *
 * @param searchQuery - The search query string to match against applicant NIK
 * @param limit - Maximum number of results to return
 * @returns Array of matching crowd gathering permit letter entries with applicant
 */
export const searchSuratIzinKeramaians = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratIzinKeramaianTable.findMany({
    where: (suratIzinKeramaians, { ilike }) =>
      ilike(suratIzinKeramaians.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all crowd gathering permit letters
 *
 * @returns The total number of crowd gathering permit letter entries
 */
export const countSuratIzinKeramaians = async () => {
  const suratIzinKeramaian = await db
    .select({ value: count() })
    .from(suratIzinKeramaianTable)
  return suratIzinKeramaian[0]?.value ?? 0
}
