import { slugify } from "@pintudesa/utils"
import { count, eq } from "drizzle-orm"

import { db } from "../connection"
import { beritaTable, type InsertBerita } from "../schema/berita"

interface InsertBeritaProps extends Omit<InsertBerita, "slug"> {}

/**
 * Create a new news article with auto-generated unique slug
 *
 * @param data - The news article data (slug will be auto-generated from title)
 * @returns The created news article with generated slug
 */
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

/**
 * Update an existing news article
 *
 * @param data - The news article data to update, including the id
 * @returns The updated news article
 */
export const updateBerita = async (data: InsertBerita & { id: string }) => {
  const berita = await db
    .update(beritaTable)
    .set(data)
    .where(eq(beritaTable.id, data.id))
    .returning()

  return berita[0]
}

/**
 * Delete a news article by ID
 *
 * @param id - The ID of the news article to delete
 * @returns The deleted news article
 */
export const deleteBerita = async (id: string) => {
  const berita = await db
    .delete(beritaTable)
    .where(eq(beritaTable.id, id))
    .returning()
  return berita[0]
}

/**
 * Get paginated list of news articles
 *
 * @param page - The page number (1-indexed)
 * @param perPage - Number of news articles per page
 * @returns Array of news articles ordered by creation date
 */
export const getBeritas = async (page: number, perPage: number) => {
  return await db.query.beritaTable.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  })
}

/**
 * Get a single news article by ID
 *
 * @param id - The ID of the news article
 * @returns The news article if found, undefined otherwise
 */
export const getBeritaById = async (id: string) => {
  return await db.query.agendaTable.findFirst({
    where: eq(beritaTable.id, id),
  })
}

/**
 * Get a single news article by slug
 *
 * @param slug - The slug of the news article
 * @returns The news article if found, undefined otherwise
 */
export const getBeritaBySlug = async (slug: string) => {
  return await db.query.beritaTable.findFirst({
    where: (berita, { eq }) => eq(berita.slug, slug),
  })
}

/**
 * Search news articles by title or slug with limit
 *
 * @param searchQuery - The search query string to match against title or slug
 * @param limit - Maximum number of results to return
 * @returns Array of matching news articles
 */
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

/**
 * Get total count of all news articles
 *
 * @returns The total number of news articles
 */
export const countBeritas = async () => {
  const berita = await db.select({ value: count() }).from(beritaTable)
  return berita[0]?.value ?? 0
}

/**
 * Generate a unique slug for a news article title
 * Appends a numeric suffix if the base slug already exists
 *
 * @param judul - The news article title to generate slug from
 * @returns A unique slug string
 */
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
