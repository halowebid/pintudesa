import { count, eq, or } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganBelumMemilikiRumahTable,
  type InsertSuratKeteranganBelumMemilikiRumah,
} from "../schema/surat-keterangan-belum-memiliki-rumah"

/**
 * Create a new certificate for not yet owning a house
 *
 * @param data - The certificate data to insert
 * @returns The created certificate entry
 */
export const insertSuratKeteranganBelumMemilikiRumah = async (
  data: InsertSuratKeteranganBelumMemilikiRumah,
) => {
  const suratKeteranganBelumMemilikiRumah = await db
    .insert(suratKeteranganBelumMemilikiRumahTable)
    .values(data)
    .returning()

  return suratKeteranganBelumMemilikiRumah[0]
}

/**
 * Update an existing certificate for not yet owning a house
 *
 * @param data - The certificate data to update, including the id
 * @returns The updated certificate entry
 */
export const updateSuratKeteranganBelumMemilikiRumah = async (
  data: InsertSuratKeteranganBelumMemilikiRumah & { id: string },
) => {
  const suratKeteranganBelumMemilikiRumah = await db
    .update(suratKeteranganBelumMemilikiRumahTable)
    .set(data)
    .where(eq(suratKeteranganBelumMemilikiRumahTable.id, data.id))
    .returning()

  return suratKeteranganBelumMemilikiRumah[0]
}

/**
 * Delete a certificate for not yet owning a house by ID
 *
 * @param id - The ID of the certificate to delete
 * @returns The deleted certificate entry
 */
export const deleteSuratKeteranganBelumMemilikiRumah = async (id: string) => {
  const suratKeteranganBelumMemilikiRumah = await db
    .delete(suratKeteranganBelumMemilikiRumahTable)
    .where(eq(suratKeteranganBelumMemilikiRumahTable.id, id))
    .returning()
  return suratKeteranganBelumMemilikiRumah[0]
}

/**
 * Get paginated list of certificates for not yet owning a house with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of certificates per page
 * @returns Array of certificate entries with applicant, ordered by creation date
 */
export const getSuratKeteranganBelumMemilikiRumahs = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganBelumMemilikiRumahTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single certificate for not yet owning a house by ID with applicant data
 *
 * @param id - The ID of the certificate
 * @returns The certificate with applicant if found, undefined otherwise
 */
export const getSuratKeteranganBelumMemilikiRumahById = async (id: string) => {
  return await db.query.suratKeteranganBelumMemilikiRumahTable.findFirst({
    where: eq(suratKeteranganBelumMemilikiRumahTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search certificates for not yet owning a house with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching certificate entries with applicant
 */
export const searchSuratKeteranganBelumMemilikiRumahs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganBelumMemilikiRumahTable.findMany({
    where: (suratKeteranganBelumMemilikiRumahs, { ilike }) =>
      or(
        ilike(
          suratKeteranganBelumMemilikiRumahs.tujuanPembuatan,
          `%${searchQuery}%`,
        ),
        ilike(
          suratKeteranganBelumMemilikiRumahs.tempatTinggalSekarang,
          `%${searchQuery}%`,
        ),
      ),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all certificates for not yet owning a house
 *
 * @returns The total number of certificate entries
 */
export const countSuratKeteranganBelumMemilikiRumahs = async () => {
  const suratKeteranganBelumMemilikiRumah = await db
    .select({ value: count() })
    .from(suratKeteranganBelumMemilikiRumahTable)
  return suratKeteranganBelumMemilikiRumah[0]?.value ?? 0
}
