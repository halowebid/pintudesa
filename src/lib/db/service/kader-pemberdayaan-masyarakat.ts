import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import {
  kaderPemberdayaanMasyarakatTable,
  type InsertKaderPemberdayaanMasyarakat,
} from "@/lib/db/schema/kader-pemberdayaan-masyarakat"

export const insertKaderPemberdayaanMasyarakat = async (
  data: InsertKaderPemberdayaanMasyarakat,
) => {
  const kaderPemberdayaanMasyarakat = await db
    .insert(kaderPemberdayaanMasyarakatTable)
    .values(data)
    .returning()

  return kaderPemberdayaanMasyarakat[0]
}

export const updateKaderPemberdayaanMasyarakat = async (
  data: InsertKaderPemberdayaanMasyarakat & { id: string },
) => {
  const kaderPemberdayaanMasyarakat = await db
    .update(kaderPemberdayaanMasyarakatTable)
    .set(data)
    .where(eq(kaderPemberdayaanMasyarakatTable.id, data.id))
    .returning()

  return kaderPemberdayaanMasyarakat[0]
}

export const deleteKaderPemberdayaanMasyarakat = async (id: string) => {
  const kaderPemberdayaanMasyarakat = await db
    .delete(kaderPemberdayaanMasyarakatTable)
    .where(eq(kaderPemberdayaanMasyarakatTable.id, id))
    .returning()
  return kaderPemberdayaanMasyarakat[0]
}

export const getKaderPemberdayaanMasyarakats = async (
  page: number,
  perPage: number,
) => {
  return await db.query.kaderPemberdayaanMasyarakatTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getKaderPemberdayaanMasyarakatById = async (id: string) => {
  return await db.query.kaderPemberdayaanMasyarakatTable.findFirst({
    where: eq(kaderPemberdayaanMasyarakatTable.id, id),
  })
}

export const searchKaderPemberdayaanMasyarakats = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.kaderPemberdayaanMasyarakatTable.findMany({
    where: (kaderPemberdayaanMasyarakats, { ilike }) =>
      ilike(kaderPemberdayaanMasyarakats.nama, `%${searchQuery}%`),
    limit: limit,
  })
}

export const countKaderPemberdayaanMasyarakats = async () => {
  const kaderPemberdayaanMasyarakat = await db
    .select({ value: count() })
    .from(kaderPemberdayaanMasyarakatTable)
  return kaderPemberdayaanMasyarakat[0]?.value ?? 0
}
