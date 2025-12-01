import { eq } from "drizzle-orm"

import { db } from "../connection"
import { settingTable, type InsertSetting } from "../schema/setting"

/**
 * Create a new setting entry
 *
 * @param data - The setting data to insert
 * @returns The created setting entry
 */
export const insertSetting = async (data: InsertSetting) => {
  const setting = await db.insert(settingTable).values(data).returning()

  return setting[0]
}

/**
 * Update an existing setting entry
 *
 * @param data - The setting data to update, including the id
 * @returns The updated setting entry
 */
export const updateSetting = async (data: InsertSetting & { id: string }) => {
  const setting = await db
    .update(settingTable)
    .set(data)
    .where(eq(settingTable.id, data.id))
    .returning()

  return setting[0]
}

/**
 * Insert or update a setting by key
 * If key exists, updates the value; otherwise inserts new entry
 *
 * @param data - The setting data to upsert
 * @returns The upserted setting entry
 */
export const upsertSetting = async (data: InsertSetting) => {
  const setting = await db
    .insert(settingTable)
    .values(data)
    .onConflictDoUpdate({
      target: settingTable.key,
      set: { value: data.value, updatedAt: new Date() },
    })
    .returning()

  return setting[0]
}

/**
 * Delete a setting entry by ID
 *
 * @param id - The ID of the setting to delete
 * @returns The deleted setting entry
 */
export const deleteSetting = async (id: string) => {
  const setting = await db
    .delete(settingTable)
    .where(eq(settingTable.id, id))
    .returning()
  return setting[0]
}

/**
 * Get all settings
 *
 * @returns Array of all setting entries
 */
export const getSettings = async () => {
  return await db.query.settingTable.findMany()
}

/**
 * Get a single setting by ID
 *
 * @param id - The ID of the setting
 * @returns The setting if found, undefined otherwise
 */
export const getSettingById = async (id: string) => {
  return await db.query.settingTable.findFirst({
    where: eq(settingTable.id, id),
  })
}

/**
 * Get a single setting by key
 *
 * @param key - The key of the setting
 * @returns The setting if found, undefined otherwise
 */
export const getSettingByKey = async (key: string) => {
  return await db.query.settingTable.findFirst({
    where: eq(settingTable.key, key),
  })
}
