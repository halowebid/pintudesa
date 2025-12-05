import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratPengantarSKCKTable,
  type InsertSuratPengantarSKCK,
} from "../schema/surat-pengantar-skck"

/**
 * Create a new SKCK cover letter
 *
 * @param data - The SKCK cover letter data to insert
 * @returns The created SKCK cover letter entry
 */
export const insertSuratPengantarSKCK = async (
  data: InsertSuratPengantarSKCK,
) => {
  const suratPengantarSKCK = await db
    .insert(suratPengantarSKCKTable)
    .values(data)
    .returning()

  return suratPengantarSKCK[0]
}

/**
 * Update an existing SKCK cover letter
 *
 * @param data - The SKCK cover letter data to update, including the id
 * @returns The updated SKCK cover letter entry
 */
export const updateSuratPengantarSKCK = async (
  data: InsertSuratPengantarSKCK & { id: string },
) => {
  const suratPengantarSKCK = await db
    .update(suratPengantarSKCKTable)
    .set(data)
    .where(eq(suratPengantarSKCKTable.id, data.id))
    .returning()

  return suratPengantarSKCK[0]
}

/**
 * Delete a SKCK cover letter by ID
 *
 * @param id - The ID of the SKCK cover letter to delete
 * @returns The deleted SKCK cover letter entry
 */
export const deleteSuratPengantarSKCK = async (id: string) => {
  const suratPengantarSKCK = await db
    .delete(suratPengantarSKCKTable)
    .where(eq(suratPengantarSKCKTable.id, id))
    .returning()
  return suratPengantarSKCK[0]
}

/**
 * Get paginated list of SKCK cover letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of SKCK cover letters per page
 * @returns Array of SKCK cover letter entries with applicant, ordered by creation date
 */
export const getSuratPengantarSKCKs = async (page: number, perPage: number) => {
  return await db.query.suratPengantarSKCKTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single SKCK cover letter by ID with applicant data
 *
 * @param id - The ID of the SKCK cover letter
 * @returns The SKCK cover letter with applicant if found, undefined otherwise
 */
export const getSuratPengantarSKCKById = async (id: string) => {
  return await db.query.suratPengantarSKCKTable.findFirst({
    where: eq(suratPengantarSKCKTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search SKCK cover letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching SKCK cover letter entries with applicant
 */
export const searchSuratPengantarSKCKs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratPengantarSKCKTable.findMany({
    where: (suratPengantarSKCKs, { ilike }) =>
      ilike(suratPengantarSKCKs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all SKCK cover letters
 *
 * @returns The total number of SKCK cover letter entries
 */
export const countSuratPengantarSKCKs = async () => {
  const suratPengantarSKCK = await db
    .select({ value: count() })
    .from(suratPengantarSKCKTable)
  return suratPengantarSKCK[0]?.value ?? 0
}
