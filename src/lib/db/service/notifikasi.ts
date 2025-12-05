import { and, count, desc, eq } from "drizzle-orm"

import { db } from "../connection"
import {
  notifikasiTable,
  type InsertNotifikasi,
  type SelectNotifikasi,
} from "../schema/notifikasi"

/**
 * Create a new notification for a specific user
 *
 * @param userId - The ID of the user to create the notification for
 * @param data - The notification data (excluding userId)
 * @returns The created notification
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
 *
 * @param userId - The ID of the user
 * @param page - The page number (1-indexed)
 * @param perPage - Number of notifications per page
 * @param unreadOnly - Optional flag to filter only unread notifications
 * @returns Array of notifications for the user
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
 *
 * @param userId - The ID of the user
 * @returns The count of unread notifications
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
 *
 * @param notifikasiId - The ID of the notification
 * @param userId - The ID of the user
 * @returns The notification if found and owned by user, undefined otherwise
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
 *
 * @param notifikasiId - The ID of the notification to mark as read
 * @param userId - The ID of the user
 * @returns The updated notification
 * @throws {Error} If notification not found or unauthorized
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
 *
 * @param userId - The ID of the user
 * @returns Object containing the count of updated notifications
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
 *
 * @param notifikasiId - The ID of the notification to delete
 * @param userId - The ID of the user
 * @returns The deleted notification
 * @throws {Error} If notification not found or unauthorized
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
