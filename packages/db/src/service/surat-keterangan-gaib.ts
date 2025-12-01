import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganGaibTable,
  type InsertSuratKeteranganGaib,
} from "../schema/surat-keterangan-gaib"

/**
 * Create a new missing person certificate letter
 *
 * @param data - The missing person certificate letter data to insert
 * @returns The created missing person certificate letter entry
 */
export const insertSuratKeteranganGaib = async (
  data: InsertSuratKeteranganGaib,
) => {
  const suratKeteranganGaib = await db
    .insert(suratKeteranganGaibTable)
    .values(data)
    .returning()

  return suratKeteranganGaib[0]
}

/**
 * Update an existing missing person certificate letter
 *
 * @param data - The missing person certificate letter data to update, including the id
 * @returns The updated missing person certificate letter entry
 */
export const updateSuratKeteranganGaib = async (
  data: InsertSuratKeteranganGaib & { id: string },
) => {
  const suratKeteranganGaib = await db
    .update(suratKeteranganGaibTable)
    .set(data)
    .where(eq(suratKeteranganGaibTable.id, data.id))
    .returning()

  return suratKeteranganGaib[0]
}

/**
 * Delete a missing person certificate letter by ID
 *
 * @param id - The ID of the missing person certificate letter to delete
 * @returns The deleted missing person certificate letter entry
 */
export const deleteSuratKeteranganGaib = async (id: string) => {
  const suratKeteranganGaib = await db
    .delete(suratKeteranganGaibTable)
    .where(eq(suratKeteranganGaibTable.id, id))
    .returning()
  return suratKeteranganGaib[0]
}

/**
 * Get paginated list of missing person certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of missing person certificate letters per page
 * @returns Array of missing person certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganGaibs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganGaibTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
      pasangan: true,
    },
  })
}

/**
 * Get a single missing person certificate letter by ID with applicant data
 *
 * @param id - The ID of the missing person certificate letter
 * @returns The missing person certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganGaibById = async (id: string) => {
  return await db.query.suratKeteranganGaibTable.findFirst({
    where: eq(suratKeteranganGaibTable.id, id),
    with: {
      pemohon: true,
      pasangan: true,
    },
  })
}

/**
 * Search missing person certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching missing person certificate letter entries with applicant
 */
export const searchSuratKeteranganGaibs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganGaibTable.findMany({
    where: (suratKeteranganGaibs, { ilike }) =>
      ilike(suratKeteranganGaibs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
      pasangan: true,
    },
  })
}

/**
 * Get total count of all missing person certificate letters
 *
 * @returns The total number of missing person certificate letter entries
 */
export const countSuratKeteranganGaibs = async () => {
  const suratKeteranganGaib = await db
    .select({ value: count() })
    .from(suratKeteranganGaibTable)
  return suratKeteranganGaib[0]?.value ?? 0
}
