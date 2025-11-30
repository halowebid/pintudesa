import { and, count, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  suratTemplateTable,
  type InsertSuratTemplate,
  type SelectSuratTemplate,
  type SuratType,
} from "../schema"

/**
 * Insert a new surat template
 * If isDefault is true, unsets existing default for that surat type
 * @param data - Template data to insert
 * @returns Newly created template
 */
export async function insertSuratTemplate(data: InsertSuratTemplate) {
  // If this template is being set as default, unset existing default
  if (data.isDefault) {
    await db
      .update(suratTemplateTable)
      .set({ isDefault: false })
      .where(
        and(
          eq(suratTemplateTable.suratType, data.suratType),
          eq(suratTemplateTable.isDefault, true),
        ),
      )
  }

  const [template] = await db
    .insert(suratTemplateTable)
    .values(data)
    .returning()

  return template
}

/**
 * Update an existing surat template
 * Handles default template switching if isDefault changes
 * @param data - Template data to update (must include id)
 * @returns Updated template
 */
export async function updateSuratTemplate(data: SelectSuratTemplate) {
  // If setting this as default, unset existing default for this type
  if (data.isDefault) {
    await db
      .update(suratTemplateTable)
      .set({ isDefault: false })
      .where(
        and(
          eq(suratTemplateTable.suratType, data.suratType),
          eq(suratTemplateTable.isDefault, true),
        ),
      )
  }

  const [template] = await db
    .update(suratTemplateTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(suratTemplateTable.id, data.id))
    .returning()

  return template
}

/**
 * Delete a surat template
 * Prevents deletion of default templates
 * @param id - Template ID to delete
 * @returns Deleted template
 * @throws Error if attempting to delete default template
 */
export async function deleteSuratTemplate(id: string) {
  // Check if this is a default template
  const results = await db
    .select()
    .from(suratTemplateTable)
    .where(eq(suratTemplateTable.id, id))
    .limit(1)

  if (results.length === 0) {
    throw new Error("Template tidak ditemukan")
  }

  const template = results[0]

  if (template.isDefault) {
    throw new Error(
      "Tidak dapat menghapus template default. Silakan set template lain sebagai default terlebih dahulu.",
    )
  }

  const [deleted] = await db
    .delete(suratTemplateTable)
    .where(eq(suratTemplateTable.id, id))
    .returning()

  return deleted
}

/**
 * Get paginated list of surat templates
 * @param page - Page number (1-indexed)
 * @param perPage - Number of items per page
 * @returns Array of templates
 */
export async function getSuratTemplates(page: number, perPage: number) {
  const offset = (page - 1) * perPage

  const templates = await db
    .select()
    .from(suratTemplateTable)
    .limit(perPage)
    .offset(offset)
    .orderBy(suratTemplateTable.suratType, suratTemplateTable.isDefault)

  return templates
}

/**
 * Get total count of surat templates
 * @returns Total number of templates
 */
export async function countSuratTemplates() {
  const [result] = await db.select({ count: count() }).from(suratTemplateTable)

  return result.count
}

/**
 * Get a single surat template by ID
 * @param id - Template ID
 * @returns Template or null if not found
 */
export async function getSuratTemplateById(id: string) {
  const results = await db
    .select()
    .from(suratTemplateTable)
    .where(eq(suratTemplateTable.id, id))
    .limit(1)

  return results[0] ?? null
}

/**
 * Get the default template for a specific surat type
 * @param suratType - Type of surat
 * @returns Default template for the type, or null if none exists
 */
export async function getDefaultTemplateForType(suratType: SuratType) {
  const results = await db
    .select()
    .from(suratTemplateTable)
    .where(
      and(
        eq(suratTemplateTable.suratType, suratType),
        eq(suratTemplateTable.isDefault, true),
      ),
    )
    .limit(1)

  return results[0] ?? null
}
