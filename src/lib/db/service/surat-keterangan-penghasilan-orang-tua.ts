import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKeteranganPenghasilanOrangTuaTable,
  type InsertSuratKeteranganPenghasilanOrangTua,
} from "../schema/surat-keterangan-penghasilan-orang-tua"

/**
 * Create a new parent income certificate letter
 *
 * @param data - The parent income certificate letter data to insert
 * @returns The created parent income certificate letter entry
 */
export const insertSuratKeteranganPenghasilanOrangTua = async (
  data: InsertSuratKeteranganPenghasilanOrangTua,
) => {
  const suratKeteranganPenghasilanOrangTua = await db
    .insert(suratKeteranganPenghasilanOrangTuaTable)
    .values(data)
    .returning()

  return suratKeteranganPenghasilanOrangTua[0]
}

/**
 * Update an existing parent income certificate letter
 *
 * @param data - The parent income certificate letter data to update, including the id
 * @returns The updated parent income certificate letter entry
 */
export const updateSuratKeteranganPenghasilanOrangTua = async (
  data: InsertSuratKeteranganPenghasilanOrangTua & { id: string },
) => {
  const suratKeteranganPenghasilanOrangTua = await db
    .update(suratKeteranganPenghasilanOrangTuaTable)
    .set(data)
    .where(eq(suratKeteranganPenghasilanOrangTuaTable.id, data.id))
    .returning()

  return suratKeteranganPenghasilanOrangTua[0]
}

/**
 * Delete a parent income certificate letter by ID
 *
 * @param id - The ID of the parent income certificate letter to delete
 * @returns The deleted parent income certificate letter entry
 */
export const deleteSuratKeteranganPenghasilanOrangTua = async (id: string) => {
  const suratKeteranganPenghasilanOrangTua = await db
    .delete(suratKeteranganPenghasilanOrangTuaTable)
    .where(eq(suratKeteranganPenghasilanOrangTuaTable.id, id))
    .returning()
  return suratKeteranganPenghasilanOrangTua[0]
}

/**
 * Get paginated list of parent income certificate letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of parent income certificate letters per page
 * @returns Array of parent income certificate letter entries with applicant, ordered by creation date
 */
export const getSuratKeteranganPenghasilanOrangTuas = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKeteranganPenghasilanOrangTuaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single parent income certificate letter by ID with applicant data
 *
 * @param id - The ID of the parent income certificate letter
 * @returns The parent income certificate letter with applicant if found, undefined otherwise
 */
export const getSuratKeteranganPenghasilanOrangTuaById = async (id: string) => {
  return await db.query.suratKeteranganPenghasilanOrangTuaTable.findFirst({
    where: eq(suratKeteranganPenghasilanOrangTuaTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search parent income certificate letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching parent income certificate letter entries with applicant
 */
export const searchSuratKeteranganPenghasilanOrangTuas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKeteranganPenghasilanOrangTuaTable.findMany({
    where: (suratKeteranganPenghasilanOrangTuas, { ilike }) =>
      ilike(suratKeteranganPenghasilanOrangTuas.pemohonNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all parent income certificate letters
 *
 * @returns The total number of parent income certificate letter entries
 */
export const countSuratKeteranganPenghasilanOrangTuas = async () => {
  const suratKeteranganPenghasilanOrangTua = await db
    .select({ value: count() })
    .from(suratKeteranganPenghasilanOrangTuaTable)
  return suratKeteranganPenghasilanOrangTua[0]?.value ?? 0
}
