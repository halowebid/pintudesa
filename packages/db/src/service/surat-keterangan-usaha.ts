import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganUsahaTable,
  type InsertSuratKeteranganUsaha,
} from "../schema/surat-keterangan-usaha"

/**
 * Create a new business certificate letter
 *
 * @param data - The business certificate letter data to insert
 * @returns The created business certificate letter entry
 */
export const insertSuratKeteranganUsaha = async (
  data: InsertSuratKeteranganUsaha,
) => {
  const suratKeteranganUsaha = await db
    .insert(suratKeteranganUsahaTable)
    .values(data)
    .returning()

  return suratKeteranganUsaha[0]
}

/**
 * Update an existing business certificate letter
 *
 * @param data - The business certificate letter data to update, including the id
 * @returns The updated business certificate letter entry
 */
export const updateSuratKeteranganUsaha = async (
  data: InsertSuratKeteranganUsaha & { id: string },
) => {
  const suratKeteranganUsaha = await db
    .update(suratKeteranganUsahaTable)
    .set(data)
    .where(eq(suratKeteranganUsahaTable.id, data.id))
    .returning()

  return suratKeteranganUsaha[0]
}

/**
 * Delete a business certificate letter by ID
 *
 * @param id - The ID of the business certificate letter to delete
 * @returns The deleted business certificate letter entry
 */
export const deleteSuratKeteranganUsaha = async (id: string) => {
  const suratKeteranganUsaha = await db
    .delete(suratKeteranganUsahaTable)
    .where(eq(suratKeteranganUsahaTable.id, id))
    .returning()
  return suratKeteranganUsaha[0]
}

/**
 * Get paginated list of business certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of business certificate letters per page
 * @returns Array of business certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganUsahas = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganUsahaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single business certificate letter by ID with applicant data
 *
 * @param id - The ID of the business certificate letter
 * @returns The business certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganUsahaById = async (id: string) => {
  return await db.query.suratKeteranganUsahaTable.findFirst({
    where: eq(suratKeteranganUsahaTable.id, id),
  })
}

/**
 * Search business certificate letters by business brand name with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching business certificate letter entries with applicant
 */
export const searchSuratKeteranganUsahas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganUsahaTable.findMany({
    where: (suratKeteranganUsahas, { ilike }) =>
      ilike(suratKeteranganUsahas.merkUsaha, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all business certificate letters
 *
 * @returns The total number of business certificate letter entries
 */
export const countSuratKeteranganUsahas = async () => {
  const suratKeteranganUsaha = await db
    .select({ value: count() })
    .from(suratKeteranganUsahaTable)
  return suratKeteranganUsaha[0]?.value ?? 0
}
