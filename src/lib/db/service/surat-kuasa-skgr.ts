import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKuasaSKGRTable,
  type InsertSuratKuasaSKGR,
} from "../schema/surat-kuasa-skgr"

/**
 * Create a new SKGR power of attorney letter
 *
 * @param data - The SKGR power of attorney letter data to insert
 * @returns The created SKGR power of attorney letter entry
 */
export const insertSuratKuasaSKGR = async (data: InsertSuratKuasaSKGR) => {
  const suratKuasaSKGR = await db
    .insert(suratKuasaSKGRTable)
    .values(data)
    .returning()

  return suratKuasaSKGR[0]
}

/**
 * Update an existing SKGR power of attorney letter
 *
 * @param data - The SKGR power of attorney letter data to update, including the id
 * @returns The updated SKGR power of attorney letter entry
 */
export const updateSuratKuasaSKGR = async (
  data: InsertSuratKuasaSKGR & { id: string },
) => {
  const suratKuasaSKGR = await db
    .update(suratKuasaSKGRTable)
    .set(data)
    .where(eq(suratKuasaSKGRTable.id, data.id))
    .returning()

  return suratKuasaSKGR[0]
}

/**
 * Delete a SKGR power of attorney letter by ID
 *
 * @param id - The ID of the SKGR power of attorney letter to delete
 * @returns The deleted SKGR power of attorney letter entry
 */
export const deleteSuratKuasaSKGR = async (id: string) => {
  const suratKuasaSKGR = await db
    .delete(suratKuasaSKGRTable)
    .where(eq(suratKuasaSKGRTable.id, id))
    .returning()
  return suratKuasaSKGR[0]
}

/**
 * Get paginated list of SKGR power of attorney letters with applicant data
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of SKGR power of attorney letters per page
 * @returns Array of SKGR power of attorney letter entries with applicant, ordered by creation date
 */
export const getSuratKuasaSKGRs = async (page: number, perPage: number) => {
  return await db.query.suratKuasaSKGRTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    with: {
      kuasaDari: true,
    },
  })
}

/**
 * Get a single SKGR power of attorney letter by ID with applicant data
 *
 * @param id - The ID of the SKGR power of attorney letter
 * @returns The SKGR power of attorney letter with applicant if found, undefined otherwise
 */
export const getSuratKuasaSKGRById = async (id: string) => {
  return await db.query.suratKuasaSKGRTable.findFirst({
    where: eq(suratKuasaSKGRTable.id, id),
    with: {
      kuasaDari: true,
    },
  })
}

/**
 * Search SKGR power of attorney letters with limit
 *
 * @param searchQuery - The search query string
 * @param limit - Maximum number of results to return
 * @returns Array of matching SKGR power of attorney letter entries with applicant
 */
export const searchSuratKuasaSKGRs = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.suratKuasaSKGRTable.findMany({
    where: (suratKuasaSKGRs, { ilike }) =>
      ilike(suratKuasaSKGRs.noReg, `%${searchQuery}%`),
    limit: limit,
    with: {
      kuasaDari: true,
    },
  })
}

/**
 * Get total count of all SKGR power of attorney letters
 *
 * @returns The total number of SKGR power of attorney letter entries
 */
export const countSuratKuasaSKGRs = async () => {
  const suratKuasaSKGR = await db
    .select({ value: count() })
    .from(suratKuasaSKGRTable)
  return suratKuasaSKGR[0]?.value ?? 0
}
