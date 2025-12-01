import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganJalanTable,
  type InsertSuratKeteranganJalan,
} from "../schema/surat-keterangan-jalan"

/**
 * Create a new road certificate letter
 *
 * @param data - The road certificate letter data to insert
 * @returns The created road certificate letter entry
 */
export const insertSuratKeteranganJalan = async (
  data: InsertSuratKeteranganJalan,
) => {
  const suratKeteranganJalan = await db
    .insert(suratKeteranganJalanTable)
    .values(data)
    .returning()

  return suratKeteranganJalan[0]
}

/**
 * Update an existing road certificate letter
 *
 * @param data - The road certificate letter data to update, including the id
 * @returns The updated road certificate letter entry
 */
export const updateSuratKeteranganJalan = async (
  data: InsertSuratKeteranganJalan & { id: string },
) => {
  const suratKeteranganJalan = await db
    .update(suratKeteranganJalanTable)
    .set(data)
    .where(eq(suratKeteranganJalanTable.id, data.id))
    .returning()

  return suratKeteranganJalan[0]
}

/**
 * Delete a road certificate letter by ID
 *
 * @param id - The ID of the road certificate letter to delete
 * @returns The deleted road certificate letter entry
 */
export const deleteSuratKeteranganJalan = async (id: string) => {
  const suratKeteranganJalan = await db
    .delete(suratKeteranganJalanTable)
    .where(eq(suratKeteranganJalanTable.id, id))
    .returning()
  return suratKeteranganJalan[0]
}

/**
 * Get paginated list of road certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of road certificate letters per page
 * @returns Array of road certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganJalans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganJalanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single road certificate letter by ID with applicant data
 *
 * @param id - The ID of the road certificate letter
 * @returns The road certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganJalanById = async (id: string) => {
  return await db.query.suratKeteranganJalanTable.findFirst({
    where: eq(suratKeteranganJalanTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search road certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching road certificate letter entries with applicant
 */
export const searchSuratKeteranganJalans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganJalanTable.findMany({
    where: (suratKeteranganJalans, { ilike }) =>
      ilike(suratKeteranganJalans.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all road certificate letters
 *
 * @returns The total number of road certificate letter entries
 */
export const countSuratKeteranganJalans = async () => {
  const suratKeteranganJalan = await db
    .select({ value: count() })
    .from(suratKeteranganJalanTable)
  return suratKeteranganJalan[0]?.value ?? 0
}
