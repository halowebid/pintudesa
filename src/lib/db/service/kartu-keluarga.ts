import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  kartuKeluargaTable,
  type InsertKartuKeluarga,
} from "../schema/kartu-keluarga"

/**
 * Create a new family card entry
 *
 * @param data - The family card data to insert
 * @returns The created family card entry
 */
export const insertKartuKeluarga = async (data: InsertKartuKeluarga) => {
  const kartuKeluarga = await db
    .insert(kartuKeluargaTable)
    .values(data)
    .returning()

  return kartuKeluarga[0]
}

/**
 * Update an existing family card entry
 *
 * @param data - The family card data to update, including the id
 * @returns The updated family card entry
 */
export const updateKartuKeluarga = async (
  data: InsertKartuKeluarga & { id: string },
) => {
  const kartuKeluarga = await db
    .update(kartuKeluargaTable)
    .set(data)
    .where(eq(kartuKeluargaTable.id, data.id))
    .returning()

  return kartuKeluarga[0]
}

/**
 * Delete a family card entry by ID
 *
 * @param id - The ID of the family card to delete
 * @returns The deleted family card entry
 */
export const deleteKartuKeluarga = async (id: string) => {
  const kartuKeluarga = await db
    .delete(kartuKeluargaTable)
    .where(eq(kartuKeluargaTable.id, id))
    .returning()
  return kartuKeluarga[0]
}

/**
 * Get paginated list of family cards with their family members
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of family cards per page
 * @returns Array of family card entries with family members, ordered by creation date
 */
export const getKartuKeluargas = async (page: number, perPage: number) => {
  return await db.query.kartuKeluargaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      anggotaKeluarga: true,
    },
  })
}

/**
 * Get a single family card by ID with family members
 *
 * @param id - The ID of the family card
 * @returns The family card with family members if found, undefined otherwise
 */
export const getKartuKeluargaById = async (id: string) => {
  return await db.query.kartuKeluargaTable.findFirst({
    where: eq(kartuKeluargaTable.id, id),
    with: {
      anggotaKeluarga: true,
    },
  })
}

/**
 * Search family cards by family card number with limit
 *
 * @param searchQuery - The search query string to match against family card number
 * @param limit - Maximum number of results to return
 * @returns Array of matching family card entries with family members
 */
export const searchKartuKeluargas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.kartuKeluargaTable.findMany({
    where: (kartuKeluargas, { ilike }) =>
      ilike(kartuKeluargas.nomorKartuKeluarga, `%${searchQuery}%`),
    limit: limit,
    with: {
      anggotaKeluarga: true,
    },
  })
}

/**
 * Get total count of all family cards
 *
 * @returns The total number of family card entries
 */
export const countKartuKeluargas = async () => {
  const kartuKeluarga = await db
    .select({ value: count() })
    .from(kartuKeluargaTable)
  return kartuKeluarga[0]?.value ?? 0
}
