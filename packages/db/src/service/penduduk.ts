import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import type { JenisKelamin } from "../schema/jenis-kelamin"
import { pendudukTable, type InsertPenduduk } from "../schema/penduduk"

/**
 * Create a new resident entry
 *
 * @param data - The resident data to insert
 * @returns The created resident entry
 */
export const insertPenduduk = async (data: InsertPenduduk) => {
  const penduduk = await db.insert(pendudukTable).values(data).returning()

  return penduduk[0]
}

/**
 * Update an existing resident entry
 *
 * @param data - The resident data to update, including the id
 * @returns The updated resident entry
 */
export const updatePenduduk = async (data: InsertPenduduk & { id: string }) => {
  const penduduk = await db
    .update(pendudukTable)
    .set(data)
    .where(eq(pendudukTable.id, data.id))
    .returning()

  return penduduk[0]
}

/**
 * Delete a resident entry by ID
 *
 * @param id - The ID of the resident to delete
 * @returns The deleted resident entry
 */
export const deletePenduduk = async (id: string) => {
  const penduduk = await db
    .delete(pendudukTable)
    .where(eq(pendudukTable.id, id))
    .returning()
  return penduduk[0]
}

/**
 * Get paginated list of residents
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of residents per page
 * @returns Array of resident entries ordered by creation date
 */
export const getPenduduks = async (page: number, perPage: number) => {
  return await db.query.pendudukTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single resident by ID
 *
 * @param id - The ID of the resident
 * @returns The resident if found, undefined otherwise
 */
export const getPendudukById = async (id: string) => {
  return await db.query.pendudukTable.findFirst({
    where: (penduduk, { eq }) => eq(penduduk.id, id),
  })
}

/**
 * Get residents filtered by gender with limit
 *
 * @param jenisKelamin - The gender to filter by
 * @returns Array of up to 10 residents matching the specified gender
 */
export const getPenduduksByJenisKelamin = async (
  jenisKelamin: JenisKelamin,
) => {
  return await db.query.pendudukTable.findMany({
    where: (penduduks, { eq }) => eq(penduduks.jenisKelamin, jenisKelamin),
    limit: 10,
  })
}

/**
 * Search residents by name or NIK with limit
 *
 * @param searchQuery - The search query string to match against name or NIK
 * @param limit - Maximum number of results to return
 * @returns Array of matching resident entries
 */
export const searchPenduduks = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.pendudukTable.findMany({
    where: (penduduks, { ilike, or }) =>
      or(
        ilike(penduduks.namaLengkap, `%${searchQuery}%`),
        ilike(penduduks.nik, `%${searchQuery}%`),
      ),
    limit: limit,
  })
}

/**
 * Search residents by name filtered by gender
 *
 * @param searchQuery - The search query string to match against name
 * @param jenisKelamin - The gender to filter by
 * @returns Array of matching resident entries with the specified gender
 */
export const searchPenduduksByJenisKelamin = async ({
  searchQuery,
  jenisKelamin,
}: {
  searchQuery: string
  jenisKelamin: JenisKelamin
}) => {
  return await db.query.pendudukTable.findMany({
    where: (penduduks, { and, ilike }) =>
      and(
        eq(penduduks.jenisKelamin, jenisKelamin),
        ilike(penduduks.namaLengkap, `%${searchQuery}%`),
      ),
  })
}

/**
 * Get total count of all residents
 *
 * @returns The total number of resident entries
 */
export const countPenduduks = async () => {
  const penduduk = await db.select({ value: count() }).from(pendudukTable)
  return penduduk[0]?.value ?? 0
}
