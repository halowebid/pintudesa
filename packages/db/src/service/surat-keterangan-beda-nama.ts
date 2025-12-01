import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganBedaNamaTable,
  type InsertSuratKeteranganBedaNama,
} from "../schema/surat-keterangan-beda-nama"

/**
 * Create a new certificate of different name letter
 *
 * @param data - The certificate data to insert
 * @returns The created certificate entry
 */
export const insertSuratKeteranganBedaNama = async (
  data: InsertSuratKeteranganBedaNama,
) => {
  const suratKeteranganBedaNama = await db
    .insert(suratKeteranganBedaNamaTable)
    .values(data)
    .returning()

  return suratKeteranganBedaNama[0]
}

/**
 * Update an existing certificate of different name letter
 *
 * @param data - The certificate data to update, including the id
 * @returns The updated certificate entry
 */
export const updateSuratKeteranganBedaNama = async (
  data: InsertSuratKeteranganBedaNama & { id: string },
) => {
  const suratKeteranganBedaNama = await db
    .update(suratKeteranganBedaNamaTable)
    .set(data)
    .where(eq(suratKeteranganBedaNamaTable.id, data.id))
    .returning()

  return suratKeteranganBedaNama[0]
}

/**
 * Delete a certificate of different name letter by ID
 *
 * @param id - The ID of the certificate to delete
 * @returns The deleted certificate entry
 */
export const deleteSuratKeteranganBedaNama = async (id: string) => {
  const suratKeteranganBedaNama = await db
    .delete(suratKeteranganBedaNamaTable)
    .where(eq(suratKeteranganBedaNamaTable.id, id))
    .returning()
  return suratKeteranganBedaNama[0]
}

/**
 * Get paginated list of certificates with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of certificates per page
 * @returns Array of certificate entries with applicant, ordered by creation date
 */
export const getSuratKeteranganBedaNamas = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganBedaNamaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single certificate by ID with applicant data
 *
 * @param id - The ID of the certificate
 * @returns The certificate with applicant if found, undefined otherwise
 */
export const getSuratKeteranganBedaNamaById = async (id: string) => {
  return await db.query.suratKeteranganBedaNamaTable.findFirst({
    where: eq(suratKeteranganBedaNamaTable.id, id),
  })
}

/**
 * Search certificates by alternate name with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching certificate entries with applicant
 */
export const searchSuratKeteranganBedaNamas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganBedaNamaTable.findMany({
    where: (suratKeteranganBedaNamas, { ilike }) =>
      ilike(suratKeteranganBedaNamas.namaLain, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all certificates
 *
 * @returns The total number of certificate entries
 */
export const countSuratKeteranganBedaNamas = async () => {
  const suratKeteranganBedaNama = await db
    .select({ value: count() })
    .from(suratKeteranganBedaNamaTable)
  return suratKeteranganBedaNama[0]?.value ?? 0
}
