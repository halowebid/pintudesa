import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganKelahiranTable,
  type InsertSuratKeteranganKelahiran,
} from "../schema/surat-keterangan-kelahiran"

/**
 * Create a new birth certificate letter
 *
 * @param data - The birth certificate letter data to insert
 * @returns The created birth certificate letter entry
 */
export const insertSuratKeteranganKelahiran = async (
  data: InsertSuratKeteranganKelahiran,
) => {
  const suratKeteranganKelahiran = await db
    .insert(suratKeteranganKelahiranTable)
    .values(data)
    .returning()

  return suratKeteranganKelahiran[0]
}

/**
 * Update an existing birth certificate letter
 *
 * @param data - The birth certificate letter data to update, including the id
 * @returns The updated birth certificate letter entry
 */
export const updateSuratKeteranganKelahiran = async (
  data: InsertSuratKeteranganKelahiran & { id: string },
) => {
  const suratKeteranganKelahiran = await db
    .update(suratKeteranganKelahiranTable)
    .set(data)
    .where(eq(suratKeteranganKelahiranTable.id, data.id))
    .returning()

  return suratKeteranganKelahiran[0]
}

/**
 * Delete a birth certificate letter by ID
 *
 * @param id - The ID of the birth certificate letter to delete
 * @returns The deleted birth certificate letter entry
 */
export const deleteSuratKeteranganKelahiran = async (id: string) => {
  const suratKeteranganKelahiran = await db
    .delete(suratKeteranganKelahiranTable)
    .where(eq(suratKeteranganKelahiranTable.id, id))
    .returning()
  return suratKeteranganKelahiran[0]
}

/**
 * Get paginated list of birth certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of birth certificate letters per page
 * @returns Array of birth certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganKelahirans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganKelahiranTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single birth certificate letter by ID with applicant data
 *
 * @param id - The ID of the birth certificate letter
 * @returns The birth certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganKelahiranById = async (id: string) => {
  return await db.query.suratKeteranganKelahiranTable.findFirst({
    where: eq(suratKeteranganKelahiranTable.id, id),
  })
}

/**
 * Search birth certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching birth certificate letter entries with applicant
 */
export const searchSuratKeteranganKelahirans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganKelahiranTable.findMany({
    where: (suratKeteranganKelahirans, { ilike }) =>
      ilike(suratKeteranganKelahirans.namaAnak, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all birth certificate letters
 *
 * @returns The total number of birth certificate letter entries
 */
export const countSuratKeteranganKelahirans = async () => {
  const suratKeteranganKelahiran = await db
    .select({ value: count() })
    .from(suratKeteranganKelahiranTable)
  return suratKeteranganKelahiran[0]?.value ?? 0
}
