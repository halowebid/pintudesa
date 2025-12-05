import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganKematianTable,
  type InsertSuratKeteranganKematian,
} from "../schema/surat-keterangan-kematian"

/**
 * Create a new death certificate letter
 *
 * @param data - The death certificate letter data to insert
 * @returns The created death certificate letter entry
 */
export const insertSuratKeteranganKematian = async (
  data: InsertSuratKeteranganKematian,
) => {
  const suratKeteranganKematian = await db
    .insert(suratKeteranganKematianTable)
    .values(data)
    .returning()

  return suratKeteranganKematian[0]
}

/**
 * Update an existing death certificate letter
 *
 * @param data - The death certificate letter data to update, including the id
 * @returns The updated death certificate letter entry
 */
export const updateSuratKeteranganKematian = async (
  data: InsertSuratKeteranganKematian & { id: string },
) => {
  const suratKeteranganKematian = await db
    .update(suratKeteranganKematianTable)
    .set(data)
    .where(eq(suratKeteranganKematianTable.id, data.id))
    .returning()

  return suratKeteranganKematian[0]
}

/**
 * Delete a death certificate letter by ID
 *
 * @param id - The ID of the death certificate letter to delete
 * @returns The deleted death certificate letter entry
 */
export const deleteSuratKeteranganKematian = async (id: string) => {
  const suratKeteranganKematian = await db
    .delete(suratKeteranganKematianTable)
    .where(eq(suratKeteranganKematianTable.id, id))
    .returning()
  return suratKeteranganKematian[0]
}

/**
 * Get paginated list of death certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of death certificate letters per page
 * @returns Array of death certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganKematians = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganKematianTable.findMany({
    with: {
      penduduk: true,
    },
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single death certificate letter by ID with applicant data
 *
 * @param id - The ID of the death certificate letter
 * @returns The death certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganKematianById = async (id: string) => {
  return await db.query.suratKeteranganKematianTable.findFirst({
    where: eq(suratKeteranganKematianTable.id, id),
    with: {
      penduduk: true,
    },
  })
}

/**
 * Search death certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching death certificate letter entries with applicant
 */
export const searchSuratKeteranganKematians = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganKematianTable.findMany({
    with: {
      penduduk: true,
    },
    where: (suratKeteranganKematians, { ilike }) =>
      ilike(suratKeteranganKematians.id, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all death certificate letters
 *
 * @returns The total number of death certificate letter entries
 */
export const countSuratKeteranganKematians = async () => {
  const suratKeteranganKematian = await db
    .select({ value: count() })
    .from(suratKeteranganKematianTable)
  return suratKeteranganKematian[0]?.value ?? 0
}
