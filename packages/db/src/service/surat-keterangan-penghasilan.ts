import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganPenghasilanTable,
  type InsertSuratKeteranganPenghasilan,
} from "../schema/surat-keterangan-penghasilan"

/**
 * Create a new income certificate letter
 *
 * @param data - The income certificate letter data to insert
 * @returns The created income certificate letter entry
 */
export const insertSuratKeteranganPenghasilan = async (
  data: InsertSuratKeteranganPenghasilan,
) => {
  const suratKeteranganPenghasilan = await db
    .insert(suratKeteranganPenghasilanTable)
    .values(data)
    .returning()

  return suratKeteranganPenghasilan[0]
}

/**
 * Update an existing income certificate letter
 *
 * @param data - The income certificate letter data to update, including the id
 * @returns The updated income certificate letter entry
 */
export const updateSuratKeteranganPenghasilan = async (
  data: InsertSuratKeteranganPenghasilan & { id: string },
) => {
  const suratKeteranganPenghasilan = await db
    .update(suratKeteranganPenghasilanTable)
    .set(data)
    .where(eq(suratKeteranganPenghasilanTable.id, data.id))
    .returning()

  return suratKeteranganPenghasilan[0]
}

/**
 * Delete a income certificate letter by ID
 *
 * @param id - The ID of the income certificate letter to delete
 * @returns The deleted income certificate letter entry
 */
export const deleteSuratKeteranganPenghasilan = async (id: string) => {
  const suratKeteranganPenghasilan = await db
    .delete(suratKeteranganPenghasilanTable)
    .where(eq(suratKeteranganPenghasilanTable.id, id))
    .returning()
  return suratKeteranganPenghasilan[0]
}

/**
 * Get paginated list of income certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of income certificate letters per page
 * @returns Array of income certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganPenghasilans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganPenghasilanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single income certificate letter by ID with applicant data
 *
 * @param id - The ID of the income certificate letter
 * @returns The income certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganPenghasilanById = async (id: string) => {
  return await db.query.suratKeteranganPenghasilanTable.findFirst({
    where: eq(suratKeteranganPenghasilanTable.id, id),
  })
}

/**
 * Search income certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching income certificate letter entries with applicant
 */
export const searchSuratKeteranganPenghasilans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganPenghasilanTable.findMany({
    where: (suratKeteranganPenghasilans, { ilike }) =>
      ilike(suratKeteranganPenghasilans.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all income certificate letters
 *
 * @returns The total number of income certificate letter entries
 */
export const countSuratKeteranganPenghasilans = async () => {
  const suratKeteranganPenghasilan = await db
    .select({ value: count() })
    .from(suratKeteranganPenghasilanTable)
  return suratKeteranganPenghasilan[0]?.value ?? 0
}
