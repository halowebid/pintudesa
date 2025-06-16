import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { agendaTable, type InsertAgenda } from "@/lib/db/schema/agenda"

export const insertAgenda = async (data: InsertAgenda) => {
  const agenda = await db.insert(agendaTable).values(data).returning()

  return agenda[0]
}

export const updateAgenda = async (data: InsertAgenda & { id: string }) => {
  const agenda = await db
    .update(agendaTable)
    .set(data)
    .where(eq(agendaTable.id, data.id))
    .returning()

  return agenda[0]
}

export const deleteAgenda = async (id: string) => {
  const agenda = await db
    .delete(agendaTable)
    .where(eq(agendaTable.id, id))
    .returning()
  return agenda[0]
}

export const getAgendas = async (page: number, perPage: number) => {
  return await db.query.agendaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getAgendaById = async (id: string) => {
  return await db.query.agendaTable.findFirst({
    where: eq(agendaTable.id, id),
  })
}

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

export const countAgendas = async () => {
  const agenda = await db.select({ value: count() }).from(agendaTable)
  return agenda[0]?.value ?? 0
}
