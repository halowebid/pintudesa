import { and, count, desc, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  notifikasiTable,
  type InsertNotifikasi,
  type SelectNotifikasi,
} from "../schema/notifikasi"

/**
 * Create a new notification for a specific user
 */
export const createNotifikasi = async (
  userId: string,
  data: Omit<InsertNotifikasi, "userId">,
) => {
  const notifikasi = await db
    .insert(notifikasiTable)
    .values({
      ...data,
      userId,
    })
    .returning()

  return notifikasi[0]
}

/**
 * Get notifications for a specific user with pagination
 * Optionally filter by unread status
 */
export const getNotifikasiByUser = async (
  userId: string,
  page: number,
  perPage: number,
  unreadOnly?: boolean,
) => {
  const whereClause = unreadOnly
    ? and(eq(notifikasiTable.userId, userId), eq(notifikasiTable.read, false))
    : eq(notifikasiTable.userId, userId)

  return await db.query.notifikasiTable.findMany({
    where: whereClause,
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: [desc(notifikasiTable.createdAt)],
  })
}

/**
 * Get count of unread notifications for a specific user
 */
export const getUnreadCount = async (userId: string) => {
  const result = await db
    .select({ value: count() })
    .from(notifikasiTable)
    .where(
      and(eq(notifikasiTable.userId, userId), eq(notifikasiTable.read, false)),
    )

  return result[0]?.value ?? 0
}

/**
 * Get a single notification by ID
 * Verifies user ownership
 */
export const getNotifikasiById = async (
  notifikasiId: string,
  userId: string,
): Promise<SelectNotifikasi | undefined> => {
  return await db.query.notifikasiTable.findFirst({
    where: and(
      eq(notifikasiTable.id, notifikasiId),
      eq(notifikasiTable.userId, userId),
    ),
  })
}

/**
 * Mark a notification as read
 * Verifies user ownership before updating
 */
export const markAsRead = async (notifikasiId: string, userId: string) => {
  const notification = await getNotifikasiById(notifikasiId, userId)

  if (!notification) {
    throw new Error("Notification not found or unauthorized")
  }

  const updated = await db
    .update(notifikasiTable)
    .set({
      read: true,
      updatedAt: new Date(),
    })
    .where(eq(notifikasiTable.id, notifikasiId))
    .returning()

  return updated[0]
}

/**
 * Mark all notifications as read for a specific user
 * Returns count of updated notifications
 */
export const markAllAsRead = async (userId: string) => {
  const updated = await db
    .update(notifikasiTable)
    .set({
      read: true,
      updatedAt: new Date(),
    })
    .where(
      and(eq(notifikasiTable.userId, userId), eq(notifikasiTable.read, false)),
    )
    .returning()

  return { count: updated.length }
}

/**
 * Delete a notification
 * Verifies user ownership before deletion
 */
export const deleteNotifikasi = async (
  notifikasiId: string,
  userId: string,
) => {
  const notification = await getNotifikasiById(notifikasiId, userId)

  if (!notification) {
    throw new Error("Notification not found or unauthorized")
  }

  const deleted = await db
    .delete(notifikasiTable)
    .where(eq(notifikasiTable.id, notifikasiId))
    .returning()

  return deleted[0]
}
