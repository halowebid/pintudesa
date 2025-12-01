import { count, eq, ilike } from "drizzle-orm"

import { db } from "../connection"
import {
  suratPindahDesaBpnTable,
  type InsertSuratPindahDesaBpn,
} from "../schema/surat-pindah-desa-bpn"

/**
 * Create a new village relocation certificate
 *
 * @param data - The relocation certificate data to insert
 * @returns The created relocation certificate entry
 */
export const insertSuratPindahDesaBpn = async (
  data: InsertSuratPindahDesaBpn,
) => {
  const suratPindahDesaBpn = await db
    .insert(suratPindahDesaBpnTable)
    .values(data)
    .returning()

  return suratPindahDesaBpn[0]
}

/**
 * Update an existing village relocation certificate
 *
 * @param data - The relocation certificate data to update, including the id
 * @returns The updated relocation certificate entry
 */
export const updateSuratPindahDesaBpn = async (
  data: InsertSuratPindahDesaBpn & { id: string },
) => {
  const suratPindahDesaBpn = await db
    .update(suratPindahDesaBpnTable)
    .set(data)
    .where(eq(suratPindahDesaBpnTable.id, data.id))
    .returning()

  return suratPindahDesaBpn[0]
}

/**
 * Delete a village relocation certificate by ID
 *
 * @param id - The ID of the relocation certificate to delete
 * @returns The deleted relocation certificate entry
 */
export const deleteSuratPindahDesaBpn = async (id: string) => {
  const suratPindahDesaBpn = await db
    .delete(suratPindahDesaBpnTable)
    .where(eq(suratPindahDesaBpnTable.id, id))
    .returning()
  return suratPindahDesaBpn[0]
}

/**
 * Get paginated list of village relocation certificates with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of relocation certificates per page
 * @returns Array of relocation certificate entries with applicant, ordered by creation date
 */
export const getSuratPindahDesaBpns = async (page: number, perPage: number) => {
  return await db.query.suratPindahDesaBpnTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single village relocation certificate by ID with applicant data
 *
 * @param id - The ID of the relocation certificate
 * @returns The relocation certificate with applicant if found, undefined otherwise
 */
export const getSuratPindahDesaBpnById = async (id: string) => {
  return await db.query.suratPindahDesaBpnTable.findFirst({
    where: eq(suratPindahDesaBpnTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search village relocation certificates with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching relocation certificate entries with applicant
 */
export const searchSuratPindahDesaBpns = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratPindahDesaBpnTable.findMany({
    where: (suratPindahDesaBpns, { or }) =>
      or(
        ilike(suratPindahDesaBpns.nomorShm, `%${searchQuery}%`),
        ilike(suratPindahDesaBpns.keteranganSurat, `%${searchQuery}%`),
      ),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all village relocation certificates
 *
 * @returns The total number of relocation certificate entries
 */
export const countSuratPindahDesaBpns = async () => {
  const suratPindahDesaBpn = await db
    .select({ value: count() })
    .from(suratPindahDesaBpnTable)
  return suratPindahDesaBpn[0]?.value ?? 0
}
