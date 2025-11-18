import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { adminProtectedProcedure, createTRPCRouter } from "../trpc"
import { handleTRPCError } from "../utils/error"

/**
 * Admin router for user management operations
 * All procedures require admin role authentication
 *
 * Note: Better-auth admin plugin only supports "user" and "admin" roles.
 * The database may have additional roles (like "member"), but admin operations
 * are limited to the two roles supported by better-auth.
 */
export const adminRouter = createTRPCRouter({
  /**
   * List users with optional filtering, sorting, and pagination
   */
  listUsers: adminProtectedProcedure
    .input(
      z.object({
        searchValue: z.string().optional(),
        searchField: z.enum(["email", "name"]).optional(),
        searchOperator: z
          .enum(["contains", "starts_with", "ends_with"])
          .optional(),
        limit: z.number().positive().optional(),
        offset: z.number().nonnegative().optional(),
        sortBy: z.string().optional(),
        sortDirection: z.enum(["asc", "desc"]).optional(),
        filterField: z.string().optional(),
        filterValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
        filterOperator: z
          .enum(["eq", "ne", "lt", "lte", "gt", "gte"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.listUsers({
          query: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Create a new user with specified role
   * Note: Only "user" and "admin" roles are supported by better-auth admin plugin
   */
  createUser: adminProtectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
        name: z.string().min(1, "Name is required"),
        role: z.enum(["user", "admin"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.createUser({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      // Remove password from response if present
      if (data && typeof data === "object" && "password" in data) {
        const { password: _, ...userWithoutPassword } = data as Record<
          string,
          unknown
        >
        return userWithoutPassword
      }

      return data
    }),

  /**
   * Set user role
   * Note: Only "user" and "admin" roles are supported by better-auth admin plugin
   */
  setRole: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        role: z.union([
          z.enum(["user", "admin"]),
          z.array(z.enum(["user", "admin"])),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.setRole({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Update user data
   */
  updateUser: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        data: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.adminUpdateUser({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Remove (delete) a user
   */
  removeUser: adminProtectedProcedure
    .input(z.string().min(1, "User ID is required"))
    .mutation(async ({ ctx, input: userId }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.removeUser({
          body: { userId },
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Ban a user with optional reason and expiration
   */
  banUser: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        banReason: z.string().optional(),
        banExpiresIn: z
          .number()
          .positive("Ban expiration must be a positive number")
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.banUser({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Unban a user
   */
  unbanUser: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.unbanUser({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * List all sessions for a specific user
   */
  listUserSessions: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.listUserSessions({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Revoke a specific user session
   */
  revokeUserSession: adminProtectedProcedure
    .input(
      z.object({
        sessionToken: z.string().min(1, "Session token is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.revokeUserSession({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),

  /**
   * Revoke all sessions for a specific user
   */
  revokeUserSessions: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(() =>
        ctx.authApi.revokeUserSessions({
          body: input,
          headers: ctx.headers,
        }),
      )

      if (error) handleTRPCError(error)

      return data
    }),
})
