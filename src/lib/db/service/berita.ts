import { count, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { beritaTable, type InsertBerita } from "@/lib/db/schema/berita"
import { slugify } from "@/lib/utils/slug"

interface InsertBeritaProps extends Omit<InsertBerita, "slug"> {}

export const insertBerita = async (data: InsertBeritaProps) => {
  const berita = await db
    .insert(beritaTable)
    .values({
      ...data,
      slug: await generateUniqueBeritaSlug(data.judul),
    })
    .returning()

  return berita[0]
}

export const updateBerita = async (data: InsertBerita & { id: string }) => {
  const berita = await db
    .update(beritaTable)
    .set(data)
    .where(eq(beritaTable.id, data.id))
    .returning()

  return berita[0]
}

export const deleteBerita = async (id: string) => {
  const berita = await db
    .delete(beritaTable)
    .where(eq(beritaTable.id, id))
    .returning()
  return berita[0]
}

export const getBeritas = async (page: number, perPage: number) => {
  return await db.query.beritaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

export const getBeritaById = async (id: string) => {
  return await db.query.agendaTable.findFirst({
    where: eq(beritaTable.id, id),
  })
}

export const getBeritaBySlug = async (slug: string) => {
  return await db.query.beritaTable.findFirst({
    where: (berita, { eq }) => eq(berita.slug, slug),
  })
}

export const searchBeritas = async ({
  searchQuery,
  limit,
}: {
  searchQuery: string
  limit: number
}) => {
  return await db.query.beritaTable.findMany({
    where: (beritas, { and, or, ilike }) =>
      and(
        or(
          ilike(beritas.judul, `%${searchQuery}%`),
          ilike(beritas.slug, `%${searchQuery}%`),
        ),
      ),
    limit: limit,
  })
}

export const countBeritas = async () => {
  const berita = await db.select({ value: count() }).from(beritaTable)
  return berita[0]?.value ?? 0
}

export const generateUniqueBeritaSlug = async (
  judul: string,
): Promise<string> => {
  const slug = slugify(judul)
  let uniqueSlug = slug
  let suffix = 1

  while (
    await db.query.beritaTable.findFirst({
      where: (berita, { eq }) => eq(berita.slug, uniqueSlug),
    })
  ) {
    suffix++
    uniqueSlug = `${slug}${suffix}`
  }

  return uniqueSlug
}
