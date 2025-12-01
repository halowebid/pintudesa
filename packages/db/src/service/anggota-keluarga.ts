import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  anggotaKeluargaTable,
  type InsertAnggotaKeluarga,
} from "../schema/anggota-keluarga"

/**
 * Create a new family member entry
 *
 * @param data - The family member data to insert
 * @returns The created family member entry
 */
export const insertAnggotaKeluarga = async (data: InsertAnggotaKeluarga) => {
  const anggotaKeluarga = await db
    .insert(anggotaKeluargaTable)
    .values(data)
    .returning()

  return anggotaKeluarga[0]
}

/**
 * Update an existing family member entry
 *
 * @param data - The family member data to update, including the id
 * @returns The updated family member entry
 */
export const updateAnggotaKeluarga = async (
  data: InsertAnggotaKeluarga & { id: string },
) => {
  const anggotaKeluarga = await db
    .update(anggotaKeluargaTable)
    .set(data)
    .where(eq(anggotaKeluargaTable.id, data.id))
    .returning()

  return anggotaKeluarga[0]
}

/**
 * Delete a family member entry by ID
 *
 * @param id - The ID of the family member to delete
 * @returns The deleted family member entry
 */
export const deleteAnggotaKeluarga = async (id: string) => {
  const anggotaKeluarga = await db
    .delete(anggotaKeluargaTable)
    .where(eq(anggotaKeluargaTable.id, id))
    .returning()
  return anggotaKeluarga[0]
}

/**
 * Get paginated list of family members
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of family members per page
 * @returns Array of family member entries ordered by creation date
 */
export const getAnggotaKeluargas = async (page: number, perPage: number) => {
  return await db.query.anggotaKeluargaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single family member by ID
 *
 * @param id - The ID of the family member
 * @returns The family member if found, undefined otherwise
 */
export const getAnggotaKeluargaById = async (id: string) => {
  return await db.query.anggotaKeluargaTable.findFirst({
    where: eq(anggotaKeluargaTable.id, id),
  })
}

/**
 * Get all family members belonging to a specific family card
 *
 * @param kartuKeluargaId - The ID of the family card
 * @returns Array of family members for the specified family card
 */
export const getAnggotaKeluargaByKartuKeluargaId = async (
  kartuKeluargaId: string,
) => {
  return await db.query.anggotaKeluargaTable.findMany({
    where: eq(anggotaKeluargaTable.kartuKeluargaId, kartuKeluargaId),
  })
}

/**
 * Search family members by resident ID with limit
 *
 * @param searchQuery - The search query string to match against resident ID
 * @param limit - Maximum number of results to return
 * @returns Array of matching family member entries
 */
export const searchAnggotaKeluargas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.anggotaKeluargaTable.findMany({
    where: (anggotaKeluargas, { ilike }) =>
      ilike(anggotaKeluargas.pendudukId, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all family members
 *
 * @returns The total number of family member entries
 */
export const countAnggotaKeluargas = async () => {
  const anggotaKeluarga = await db
    .select({ value: count() })
    .from(anggotaKeluargaTable)
  return anggotaKeluarga[0]?.value ?? 0
}
