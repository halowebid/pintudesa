import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganDomisiliKeluargaTable,
  suratKeteranganDomisiliTable,
  type InsertSuratKeteranganDomisili,
} from "../schema/surat-keterangan-domisili"

/**
 * Create a new domicile certificate letter
 *
 * @param data - The domicile certificate letter data to insert
 * @returns The created domicile certificate letter entry
 */
export const insertSuratKeteranganDomisili = async (
  data: InsertSuratKeteranganDomisili & {
    pendudukIds: string[]
  },
) => {
  const suratKeteranganDomisili = await db
    .insert(suratKeteranganDomisiliTable)
    .values(data)
    .returning()

  await db
    .insert(suratKeteranganDomisiliKeluargaTable)
    .values(
      data.pendudukIds.map((pendudukId) => ({
        pendudukId,
        suratKeteranganDomisiliId: suratKeteranganDomisili[0].id,
      })),
    )
    .returning()

  return suratKeteranganDomisili[0]
}

/**
 * Update an existing domicile certificate letter
 *
 * @param data - The domicile certificate letter data to update, including the id
 * @returns The updated domicile certificate letter entry
 */
export const updateSuratKeteranganDomisili = async (
  data: InsertSuratKeteranganDomisili & { id: string },
) => {
  const suratKeteranganDomisili = await db
    .update(suratKeteranganDomisiliTable)
    .set(data)
    .where(eq(suratKeteranganDomisiliTable.id, data.id))
    .returning()

  return suratKeteranganDomisili[0]
}

/**
 * Delete a domicile certificate letter by ID
 *
 * @param id - The ID of the domicile certificate letter to delete
 * @returns The deleted domicile certificate letter entry
 */
export const deleteSuratKeteranganDomisili = async (id: string) => {
  const suratKeteranganDomisili = await db
    .delete(suratKeteranganDomisiliTable)
    .where(eq(suratKeteranganDomisiliTable.id, id))
    .returning()
  return suratKeteranganDomisili[0]
}

/**
 * Get paginated list of domicile certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of domicile certificate letters per page
 * @returns Array of domicile certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganDomisilis = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganDomisiliTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
      keluarga: true,
    },
  })
}

/**
 * Get a single domicile certificate letter by ID with applicant data
 *
 * @param id - The ID of the domicile certificate letter
 * @returns The domicile certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganDomisiliById = async (id: string) => {
  return await db.query.suratKeteranganDomisiliTable.findFirst({
    where: eq(suratKeteranganDomisiliTable.id, id),
    with: {
      pemohon: true,
      keluarga: true,
    },
  })
}

/**
 * Search domicile certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching domicile certificate letter entries with applicant
 */
export const searchSuratKeteranganDomisilis = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganDomisiliTable.findMany({
    where: (suratKeteranganDomisilis, { ilike }) =>
      ilike(suratKeteranganDomisilis.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
      keluarga: true,
    },
  })
}

/**
 * Get total count of all domicile certificate letters
 *
 * @returns The total number of domicile certificate letter entries
 */
export const countSuratKeteranganDomisilis = async () => {
  const suratKeteranganDomisili = await db
    .select({ value: count() })
    .from(suratKeteranganDomisiliTable)
  return suratKeteranganDomisili[0]?.value ?? 0
}
