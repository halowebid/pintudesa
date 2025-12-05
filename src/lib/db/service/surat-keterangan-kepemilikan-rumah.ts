import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganKepemilikanRumahTable,
  type InsertSuratKeteranganKepemilikanRumah,
} from "../schema/surat-keterangan-kepemilikan-rumah"

/**
 * Create a new house ownership certificate letter
 *
 * @param data - The house ownership certificate letter data to insert
 * @returns The created house ownership certificate letter entry
 */
export const insertSuratKeteranganKepemilikanRumah = async (
  data: InsertSuratKeteranganKepemilikanRumah,
) => {
  const suratKeteranganKepemilikanRumah = await db
    .insert(suratKeteranganKepemilikanRumahTable)
    .values(data)
    .returning()

  return suratKeteranganKepemilikanRumah[0]
}

/**
 * Update an existing house ownership certificate letter
 *
 * @param data - The house ownership certificate letter data to update, including the id
 * @returns The updated house ownership certificate letter entry
 */
export const updateSuratKeteranganKepemilikanRumah = async (
  data: InsertSuratKeteranganKepemilikanRumah & { id: string },
) => {
  const suratKeteranganKepemilikanRumah = await db
    .update(suratKeteranganKepemilikanRumahTable)
    .set(data)
    .where(eq(suratKeteranganKepemilikanRumahTable.id, data.id))
    .returning()

  return suratKeteranganKepemilikanRumah[0]
}

/**
 * Delete a house ownership certificate letter by ID
 *
 * @param id - The ID of the house ownership certificate letter to delete
 * @returns The deleted house ownership certificate letter entry
 */
export const deleteSuratKeteranganKepemilikanRumah = async (id: string) => {
  const suratKeteranganKepemilikanRumah = await db
    .delete(suratKeteranganKepemilikanRumahTable)
    .where(eq(suratKeteranganKepemilikanRumahTable.id, id))
    .returning()
  return suratKeteranganKepemilikanRumah[0]
}

/**
 * Get paginated list of house ownership certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of house ownership certificate letters per page
 * @returns Array of house ownership certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganKepemilikanRumahs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganKepemilikanRumahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single house ownership certificate letter by ID with applicant data
 *
 * @param id - The ID of the house ownership certificate letter
 * @returns The house ownership certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganKepemilikanRumahById = async (id: string) => {
  return await db.query.suratKeteranganKepemilikanRumahTable.findFirst({
    where: eq(suratKeteranganKepemilikanRumahTable.id, id),
  })
}

/**
 * Search house ownership certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching house ownership certificate letter entries with applicant
 */
export const searchSuratKeteranganKepemilikanRumahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganKepemilikanRumahTable.findMany({
    where: (suratKeteranganKepemilikanRumahs, { ilike }) =>
      ilike(suratKeteranganKepemilikanRumahs.alamatRumah, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all house ownership certificate letters
 *
 * @returns The total number of house ownership certificate letter entries
 */
export const countSuratKeteranganKepemilikanRumahs = async () => {
  const suratKeteranganKepemilikanRumah = await db
    .select({ value: count() })
    .from(suratKeteranganKepemilikanRumahTable)
  return suratKeteranganKepemilikanRumah[0]?.value ?? 0
}
