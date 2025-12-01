import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganPenyaksianTanahTable,
  type InsertSuratKeteranganPenyaksianTanah,
} from "../schema/surat-keterangan-penyaksian-tanah"

/**
 * Create a new land witnessing certificate letter
 *
 * @param data - The land witnessing certificate letter data to insert
 * @returns The created land witnessing certificate letter entry
 */
export const insertSuratKeteranganPenyaksianTanah = async (
  data: InsertSuratKeteranganPenyaksianTanah & {
    pendudukIds: string[]
  },
) => {
  const suratKeteranganPenyaksianTanah = await db
    .insert(suratKeteranganPenyaksianTanahTable)
    .values(data)
    .returning()

  return suratKeteranganPenyaksianTanah[0]
}

/**
 * Update an existing land witnessing certificate letter
 *
 * @param data - The land witnessing certificate letter data to update, including the id
 * @returns The updated land witnessing certificate letter entry
 */
export const updateSuratKeteranganPenyaksianTanah = async (
  data: InsertSuratKeteranganPenyaksianTanah & { id: string },
) => {
  const suratKeteranganPenyaksianTanah = await db
    .update(suratKeteranganPenyaksianTanahTable)
    .set(data)
    .where(eq(suratKeteranganPenyaksianTanahTable.id, data.id))
    .returning()

  return suratKeteranganPenyaksianTanah[0]
}

/**
 * Delete a land witnessing certificate letter by ID
 *
 * @param id - The ID of the land witnessing certificate letter to delete
 * @returns The deleted land witnessing certificate letter entry
 */
export const deleteSuratKeteranganPenyaksianTanah = async (id: string) => {
  const suratKeteranganPenyaksianTanah = await db
    .delete(suratKeteranganPenyaksianTanahTable)
    .where(eq(suratKeteranganPenyaksianTanahTable.id, id))
    .returning()
  return suratKeteranganPenyaksianTanah[0]
}

/**
 * Get paginated list of land witnessing certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of land witnessing certificate letters per page
 * @returns Array of land witnessing certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganPenyaksianTanahs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganPenyaksianTanahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single land witnessing certificate letter by ID with applicant data
 *
 * @param id - The ID of the land witnessing certificate letter
 * @returns The land witnessing certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganPenyaksianTanahById = async (id: string) => {
  return await db.query.suratKeteranganPenyaksianTanahTable.findFirst({
    where: eq(suratKeteranganPenyaksianTanahTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search land witnessing certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching land witnessing certificate letter entries with applicant
 */
export const searchSuratKeteranganPenyaksianTanahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganPenyaksianTanahTable.findMany({
    where: (suratKeteranganPenyaksianTanahs, { ilike }) =>
      ilike(suratKeteranganPenyaksianTanahs.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all land witnessing certificate letters
 *
 * @returns The total number of land witnessing certificate letter entries
 */
export const countSuratKeteranganPenyaksianTanahs = async () => {
  const suratKeteranganPenyaksianTanah = await db
    .select({ value: count() })
    .from(suratKeteranganPenyaksianTanahTable)
  return suratKeteranganPenyaksianTanah[0]?.value ?? 0
}
