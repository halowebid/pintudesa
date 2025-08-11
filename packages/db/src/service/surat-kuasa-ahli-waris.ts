import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKuasaAhliWarisTable,
  type InsertSuratKuasaAhliWaris,
} from "../schema/surat-kuasa-ahli-waris"

export const insertSuratKuasaAhliWaris = async (
  data: InsertSuratKuasaAhliWaris,
) => {
  const suratKuasaAhliWaris = await db
    .insert(suratKuasaAhliWarisTable)
    .values(data)
    .returning()

  return suratKuasaAhliWaris[0]
}

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

export const deleteSuratKuasaAhliWaris = async (id: string) => {
  const suratKuasaAhliWaris = await db
    .delete(suratKuasaAhliWarisTable)
    .where(eq(suratKuasaAhliWarisTable.id, id))
    .returning()
  return suratKuasaAhliWaris[0]
}

export const getSuratKuasaAhliWariss = async (
  page: number,
  perPage: number,
) => {
  return await db.query.suratKuasaAhliWarisTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getSuratKuasaAhliWarisById = async (id: string) => {
  return await db.query.suratKuasaAhliWarisTable.findFirst({
    where: eq(suratKuasaAhliWarisTable.id, id),
  })
}

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
  })
}

export const countSuratKuasaAhliWariss = async () => {
  const suratKuasaAhliWaris = await db
    .select({ value: count() })
    .from(suratKuasaAhliWarisTable)
  return suratKuasaAhliWaris[0]?.value ?? 0
}
