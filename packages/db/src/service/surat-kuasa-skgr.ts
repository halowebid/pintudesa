import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratKuasaSKGRTable,
  type InsertSuratKuasaSKGR,
} from "../schema/surat-kuasa-skgr"

export const insertSuratKuasaSKGR = async (data: InsertSuratKuasaSKGR) => {
  const suratKuasaSKGR = await db
    .insert(suratKuasaSKGRTable)
    .values(data)
    .returning()

  return suratKuasaSKGR[0]
}

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

export const deleteSuratKuasaSKGR = async (id: string) => {
  const suratKuasaSKGR = await db
    .delete(suratKuasaSKGRTable)
    .where(eq(suratKuasaSKGRTable.id, id))
    .returning()
  return suratKuasaSKGR[0]
}

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

export const getSuratKuasaSKGRById = async (id: string) => {
  return await db.query.suratKuasaSKGRTable.findFirst({
    where: eq(suratKuasaSKGRTable.id, id),
    with: {
      kuasaDari: true,
    },
  })
}

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

export const countSuratKuasaSKGRs = async () => {
  const suratKuasaSKGR = await db
    .select({ value: count() })
    .from(suratKuasaSKGRTable)
  return suratKuasaSKGR[0]?.value ?? 0
}
