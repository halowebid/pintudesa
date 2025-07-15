import { eq } from "drizzle-orm"

import { db } from "../connection"
import { settingTable, type InsertSetting } from "../schema/setting"

export const insertSetting = async (data: InsertSetting) => {
  const setting = await db.insert(settingTable).values(data).returning()

  return setting[0]
}

export const updateSetting = async (data: InsertSetting & { id: string }) => {
  const setting = await db
    .update(settingTable)
    .set(data)
    .where(eq(settingTable.id, data.id))
    .returning()

  return setting[0]
}

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

export const deleteSetting = async (id: string) => {
  const setting = await db
    .delete(settingTable)
    .where(eq(settingTable.id, id))
    .returning()
  return setting[0]
}

export const getSettings = async () => {
  return await db.query.settingTable.findMany()
}

export const getSettingById = async (id: string) => {
  return await db.query.settingTable.findFirst({
    where: eq(settingTable.id, id),
  })
}

export const getSettingByKey = async (key: string) => {
  return await db.query.settingTable.findFirst({
    where: eq(settingTable.key, key),
  })
}
