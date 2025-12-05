import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganDomisiliUsahaTable,
  type InsertSuratKeteranganDomisiliUsaha,
} from "../schema/surat-keterangan-domisili-usaha"

/**
 * Create a new business domicile certificate
 *
 * @param data - The business domicile certificate data to insert
 * @returns The created business domicile certificate entry
 */
export const insertSuratKeteranganDomisiliUsaha = async (
  data: InsertSuratKeteranganDomisiliUsaha,
) => {
  const suratKeteranganDomisiliUsaha = await db
    .insert(suratKeteranganDomisiliUsahaTable)
    .values(data)
    .returning()

  return suratKeteranganDomisiliUsaha[0]
}

/**
 * Update an existing business domicile certificate
 *
 * @param data - The business domicile certificate data to update, including the id
 * @returns The updated business domicile certificate entry
 */
export const updateSuratKeteranganDomisiliUsaha = async (
  data: InsertSuratKeteranganDomisiliUsaha & { id: string },
) => {
  const suratKeteranganDomisiliUsaha = await db
    .update(suratKeteranganDomisiliUsahaTable)
    .set(data)
    .where(eq(suratKeteranganDomisiliUsahaTable.id, data.id))
    .returning()

  return suratKeteranganDomisiliUsaha[0]
}

/**
 * Delete a business domicile certificate by ID
 *
 * @param id - The ID of the business domicile certificate to delete
 * @returns The deleted business domicile certificate entry
 */
export const deleteSuratKeteranganDomisiliUsaha = async (id: string) => {
  const suratKeteranganDomisiliUsaha = await db
    .delete(suratKeteranganDomisiliUsahaTable)
    .where(eq(suratKeteranganDomisiliUsahaTable.id, id))
    .returning()
  return suratKeteranganDomisiliUsaha[0]
}

/**
 * Get paginated list of business domicile certificates with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of business domicile certificates per page
 * @returns Array of business domicile certificate entries with applicant, ordered by creation date
 */
export const getSuratKeteranganDomisiliUsahas = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganDomisiliUsahaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single business domicile certificate by ID with applicant data
 *
 * @param id - The ID of the business domicile certificate
 * @returns The business domicile certificate with applicant if found, undefined otherwise
 */
export const getSuratKeteranganDomisiliUsahaById = async (id: string) => {
  return await db.query.suratKeteranganDomisiliUsahaTable.findFirst({
    where: eq(suratKeteranganDomisiliUsahaTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search business domicile certificates with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching business domicile certificate entries with applicant
 */
export const searchSuratKeteranganDomisiliUsahas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganDomisiliUsahaTable.findMany({
    where: (suratKeteranganDomisiliUsahas, { ilike }) =>
      ilike(suratKeteranganDomisiliUsahas.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all business domicile certificates
 *
 * @returns The total number of business domicile certificate entries
 */
export const countSuratKeteranganDomisiliUsahas = async () => {
  const suratKeteranganDomisiliUsaha = await db
    .select({ value: count() })
    .from(suratKeteranganDomisiliUsahaTable)
  return suratKeteranganDomisiliUsaha[0]?.value ?? 0
}
