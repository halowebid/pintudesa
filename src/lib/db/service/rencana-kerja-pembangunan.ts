import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  rencanaKerjaPembangunanTable,
  type InsertRencanaKerjaPembangunan,
} from "@/lib/db/schema/rencana-kerja-pembangunan"

export const insertRencanaKerjaPembangunan = async (
  data: InsertRencanaKerjaPembangunan,
) => {
  const rencanaKerjaPembangunan = await db
    .insert(rencanaKerjaPembangunanTable)
    .values(data)
    .returning()

  return rencanaKerjaPembangunan[0]
}

export const updateRencanaKerjaPembangunan = async (
  data: InsertRencanaKerjaPembangunan & { id: string },
) => {
  const rencanaKerjaPembangunan = await db
    .update(rencanaKerjaPembangunanTable)
    .set(data)
    .where(eq(rencanaKerjaPembangunanTable.id, data.id))
    .returning()

  return rencanaKerjaPembangunan[0]
}

export const deleteRencanaKerjaPembangunan = async (id: string) => {
  const rencanaKerjaPembangunan = await db
    .delete(rencanaKerjaPembangunanTable)
    .where(eq(rencanaKerjaPembangunanTable.id, id))
    .returning()
  return rencanaKerjaPembangunan[0]
}

export const getRencanaKerjaPembangunans = async (
  page: number,
  perPage: number,
) => {
  return await db.query.rencanaKerjaPembangunanTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getRencanaKerjaPembangunanById = async (id: string) => {
  return await db.query.rencanaKerjaPembangunanTable.findFirst({
    where: eq(rencanaKerjaPembangunanTable.id, id),
  })
}

export const searchRencanaKerjaPembangunans = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.rencanaKerjaPembangunanTable.findMany({
    where: (rencanaKerjaPembangunans, { ilike }) =>
      ilike(rencanaKerjaPembangunans.namaKegiatan, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countRencanaKerjaPembangunans = async () => {
  const rencanaKerjaPembangunan = await db
    .select({ value: count() })
    .from(rencanaKerjaPembangunanTable)
  return rencanaKerjaPembangunan[0]?.value ?? 0
}
