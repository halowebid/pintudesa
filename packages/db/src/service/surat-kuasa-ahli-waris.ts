import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKuasaAhliWarisTable,
  type InsertSuratKuasaAhliWaris,
} from "../schema/surat-kuasa-ahli-waris"

/**
 * Create a new heir power of attorney letter
 *
 * @param data - The heir power of attorney letter data to insert
 * @returns The created heir power of attorney letter entry
 */
export const insertSuratKuasaAhliWaris = async (
  data: InsertSuratKuasaAhliWaris,
) => {
  const suratKuasaAhliWaris = await db
    .insert(suratKuasaAhliWarisTable)
    .values(data)
    .returning()

  return suratKuasaAhliWaris[0]
}

/**
 * Update an existing heir power of attorney letter
 *
 * @param data - The heir power of attorney letter data to update, including the id
 * @returns The updated heir power of attorney letter entry
 */
export const updateSuratKuasaAhliWaris = async (
  data: InsertSuratKuasaAhliWaris & { id: string },
) => {
  const suratKuasaAhliWaris = await db
    .update(suratKuasaAhliWarisTable)
    .set(data)
    .where(eq(suratKuasaAhliWarisTable.id, data.id))
    .returning()

  return suratKuasaAhliWaris[0]
}

/**
 * Delete a heir power of attorney letter by ID
 *
 * @param id - The ID of the heir power of attorney letter to delete
 * @returns The deleted heir power of attorney letter entry
 */
export const deleteSuratKuasaAhliWaris = async (id: string) => {
  const suratKuasaAhliWaris = await db
    .delete(suratKuasaAhliWarisTable)
    .where(eq(suratKuasaAhliWarisTable.id, id))
    .returning()
  return suratKuasaAhliWaris[0]
}

/**
 * Get paginated list of heir power of attorney letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of heir power of attorney letters per page
 * @returns Array of heir power of attorney letter entries with applicant, ordered by creation date
 */
export const getSuratKuasaAhliWariss = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKuasaAhliWarisTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get a single heir power of attorney letter by ID with applicant data
 *
 * @param id - The ID of the heir power of attorney letter
 * @returns The heir power of attorney letter with applicant if found, undefined otherwise
 */
export const getSuratKuasaAhliWarisById = async (id: string) => {
  return await db.query.suratKuasaAhliWarisTable.findFirst({
    where: eq(suratKuasaAhliWarisTable.id, id),
    with: {
      pemohon: true,
    },
  })
}

/**
 * Search heir power of attorney letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching heir power of attorney letter entries with applicant
 */
export const searchSuratKuasaAhliWariss = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKuasaAhliWarisTable.findMany({
    where: (suratKuasaAhliWariss, { ilike }) =>
      ilike(suratKuasaAhliWariss.ahaliWarisNIK, `%${searchQuery}%`),
    limit: limit,
    with: {
      pemohon: true,
    },
  })
}

/**
 * Get total count of all heir power of attorney letters
 *
 * @returns The total number of heir power of attorney letter entries
 */
export const countSuratKuasaAhliWariss = async () => {
  const suratKuasaAhliWaris = await db
    .select({ value: count() })
    .from(suratKuasaAhliWarisTable)
  return suratKuasaAhliWaris[0]?.value ?? 0
}
