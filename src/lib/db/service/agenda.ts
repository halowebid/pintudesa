import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { agendaTable, type InsertAgenda } from "../schema/agenda"

/**
 * Create a new agenda entry
 *
 * @param data - The agenda data to insert
 * @returns The created agenda entry
 */
export const insertAgenda = async (data: InsertAgenda) => {
  const agenda = await db.insert(agendaTable).values(data).returning()

  return agenda[0]
}

/**
 * Update an existing agenda entry
 *
 * @param data - The agenda data to update, including the id
 * @returns The updated agenda entry
 */
export const updateAgenda = async (data: InsertAgenda & { id: string }) => {
  const agenda = await db
    .update(agendaTable)
    .set(data)
    .where(eq(agendaTable.id, data.id))
    .returning()

  return agenda[0]
}

/**
 * Delete an agenda entry by ID
 *
 * @param id - The ID of the agenda to delete
 * @returns The deleted agenda entry
 */
export const deleteAgenda = async (id: string) => {
  const agenda = await db
    .delete(agendaTable)
    .where(eq(agendaTable.id, id))
    .returning()
  return agenda[0]
}

/**
 * Get paginated list of agendas
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of agendas per page
 * @returns Array of agenda entries ordered by creation date
 */
export const getAgendas = async (page: number, perPage: number) => {
  return await db.query.agendaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single agenda by ID
 *
 * @param id - The ID of the agenda
 * @returns The agenda if found, undefined otherwise
 */
export const getAgendaById = async (id: string) => {
  return await db.query.agendaTable.findFirst({
    where: eq(agendaTable.id, id),
  })
}

/**
 * Search agendas by letter type with limit
 *
 * @param searchQuery - The search query string to match against letter type
 * @param limit - Maximum number of results to return
 * @returns Array of matching agenda entries
 */
export const searchAgendas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.agendaTable.findMany({
    where: (agendas, { ilike }) =>
      ilike(agendas.jenisSurat, `%${searchQuery}%`),
    limit: limit,
  })
}

/**
 * Get total count of all agendas
 *
 * @returns The total number of agenda entries
 */
export const countAgendas = async () => {
  const agenda = await db.select({ value: count() }).from(agendaTable)
  return agenda[0]?.value ?? 0
}
