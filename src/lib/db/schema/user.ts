import { createCustomId } from "@/lib/utils"
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

export const USER_ROLE = ["user", "member", "admin"] as const

export const userRole = z.enum(USER_ROLE)

export const userRoleEnum = pgEnum("user_role", USER_ROLE)

export const userTable = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  email: text("email"),
  emailVerified: boolean("email_verified").notNull(),
  name: text("name"),
  image: text("image"),
  phoneNumber: text("phone_number"),
  about: text("about"),
  role: userRoleEnum("role").notNull().default("user"),
  /**
   * Indicates whether the user is banned from accessing the system
   */
  banned: boolean("banned").notNull().default(false),
  /**
   * The reason why the user was banned (optional)
   */
  banReason: text("ban_reason"),
  /**
   * The timestamp when the ban expires (optional, null means permanent ban)
   */
  banExpires: timestamp("ban_expires", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const accountTable = pgTable("accounts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const sessionTable = pgTable("sessions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  /**
   * The ID of the admin user who is impersonating this session (optional)
   */
  impersonatedBy: text("impersonated_by"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const verificationTable = pgTable("verifications", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createCustomId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const insertUserSchema = createInsertSchema(userTable)
export const updateUserSchema = createUpdateSchema(userTable)

export type SelectUser = typeof userTable.$inferSelect
export type SelectSession = typeof sessionTable.$inferSelect
export type InsertUser = typeof userTable.$inferInsert

export type UserRole = z.infer<typeof userRole>
