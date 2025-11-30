import { createCustomId } from "@pintudesa/utils"
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

import { userTable } from "./user"

/**
 * Notification types that can be sent to users
 */
export const NOTIFICATION_TYPE = [
  "system",
  "letter_created",
  "letter_updated",
  "letter_approved",
  "letter_rejected",
  "document_updated",
  "admin_action",
] as const

export const notificationTypeEnum = pgEnum(
  "notification_type",
  NOTIFICATION_TYPE,
)

/**
 * Notification table schema
 * Stores notifications for users with read status and related entity references
 */
export const notifikasiTable = pgTable(
  "notifikasi",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createCustomId()),
    /**
     * User ID who owns this notification
     * Cascades deletion when user is deleted
     */
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    /**
     * Short notification headline
     */
    title: text("title").notNull(),
    /**
     * Detailed notification message
     */
    message: text("message").notNull(),
    /**
     * Type of notification (system, letter_created, etc.)
     */
    type: notificationTypeEnum("type").notNull(),
    /**
     * Whether the notification has been read
     */
    read: boolean("read").notNull().default(false),
    /**
     * Optional ID of related entity (e.g., letter ID, document ID)
     */
    relatedEntityId: text("related_entity_id"),
    /**
     * Type of related entity (e.g., "surat", "berita")
     */
    relatedEntityType: text("related_entity_type"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    // Index for querying user's notifications
    userIdIdx: index("idx_notifikasi_user_id").on(table.userId),
    // Index for ordering by creation date
    createdAtIdx: index("idx_notifikasi_created_at").on(table.createdAt),
    // Index for filtering unread notifications
    readIdx: index("idx_notifikasi_read").on(table.read),
    // Composite index for common query pattern: user's unread notifications ordered by date
    userReadCreatedIdx: index("idx_notifikasi_user_read_created").on(
      table.userId,
      table.read,
      table.createdAt,
    ),
  }),
)

export const insertNotifikasiSchema = createInsertSchema(notifikasiTable)
export const updateNotifikasiSchema = createUpdateSchema(notifikasiTable)

export type SelectNotifikasi = typeof notifikasiTable.$inferSelect
export type InsertNotifikasi = typeof notifikasiTable.$inferInsert
