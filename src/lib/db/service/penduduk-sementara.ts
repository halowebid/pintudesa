import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  pendudukSementaraTable,
  type InsertPendudukSementara,
} from "../schema/penduduk-sementara"

/**
 * Create a new temporary resident entry
 *
 * @param data - The temporary resident data to insert
 * @returns The created temporary resident entry
 */
export const insertPendudukSementara = async (
  data: InsertPendudukSementara,
) => {
  const pendudukSementara = await db
    .insert(pendudukSementaraTable)
    .values(data)
    .returning()

  return pendudukSementara[0]
}

/**
 * Update an existing temporary resident entry
 *
 * @param data - The temporary resident data to update, including the id
 * @returns The updated temporary resident entry
 */
export const updatePendudukSementara = async (
  data: InsertPendudukSementara & { id: string },
) => {
  const pendudukSementara = await db
    .update(pendudukSementaraTable)
    .set(data)
    .where(eq(pendudukSementaraTable.id, data.id))
    .returning()

  return pendudukSementara[0]
}

/**
 * Delete a temporary resident entry by ID
 *
 * @param id - The ID of the temporary resident to delete
 * @returns The deleted temporary resident entry
 */
export const deletePendudukSementara = async (id: string) => {
  const pendudukSementara = await db
    .delete(pendudukSementaraTable)
    .where(eq(pendudukSementaraTable.id, id))
    .returning()
  return pendudukSementara[0]
}

/**
 * Get paginated list of temporary residents
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of temporary residents per page
 * @returns Array of temporary resident entries ordered by creation date
 */
export const getPendudukSementaras = async (page: number, perPage: number) => {
  return await db.query.pendudukSementaraTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single temporary resident by ID
 *
 * @param id - The ID of the temporary resident
 * @returns The temporary resident if found, undefined otherwise
 */
export const getPendudukSementaraById = async (id: string) => {
  return await db.query.pendudukSementaraTable.findFirst({
    where: eq(pendudukSementaraTable.id, id),
  })
}

/**
 * Search temporary residents by name with limit
 *
 * @param searchQuery - The search query string to match against name
 * @param limit - Maximum number of results to return
 * @returns Array of matching temporary resident entries
 */
export const searchPendudukSementaras = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.pendudukSementaraTable.findMany({
    where: (pendudukSementaras, { ilike }) =>
      ilike(pendudukSementaras.nama, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all temporary residents
 *
 * @returns The total number of temporary resident entries
 */
export const countPendudukSementaras = async () => {
  const pendudukSementara = await db
    .select({ value: count() })
    .from(pendudukSementaraTable)
  return pendudukSementara[0]?.value ?? 0
}
