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
   *
   * @param input - Query parameters for filtering, sorting, and pagination
   * @param input.searchValue - Optional search value to filter users
   * @param input.searchField - Field to search in (email or name)
   * @param input.searchOperator - Search operator (contains, starts_with, ends_with)
   * @param input.limit - Maximum number of users to return
   * @param input.offset - Number of users to skip
   * @param input.sortBy - Field to sort by
   * @param input.sortDirection - Sort direction (asc or desc)
   * @param input.filterField - Field to filter by
   * @param input.filterValue - Value to filter by
   * @param input.filterOperator - Filter operator (eq, ne, lt, lte, gt, gte)
   * @returns Paginated list of users
   * @throws {TRPCError} If the query fails or user is unauthorized
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
   *
   * @param input - User creation data
   * @param input.email - User email address (must be valid email format)
   * @param input.password - User password (minimum 8 characters)
   * @param input.name - User full name
   * @param input.role - User role (optional, defaults to "user")
   * @returns The created user object (without password field)
   * @throws {TRPCError} If creation fails, email is invalid, or user is unauthorized
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
   *
   * @param input - Role assignment data
   * @param input.userId - The ID of the user to update
   * @param input.role - The role(s) to assign (single role or array of roles)
   * @returns The updated user data
   * @throws {TRPCError} If update fails, user not found, or requester is unauthorized
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
   *
   * @param input - User update data
   * @param input.userId - The ID of the user to update
   * @param input.data - Object containing fields to update
   * @returns The updated user data
   * @throws {TRPCError} If update fails, user not found, or requester is unauthorized
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
   *
   * @param input - The user ID to delete
   * @returns Confirmation of deletion
   * @throws {TRPCError} If deletion fails, user not found, or requester is unauthorized
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
   *
   * @param input - Ban configuration data
   * @param input.userId - The ID of the user to ban
   * @param input.banReason - Optional reason for the ban
   * @param input.banExpiresIn - Optional ban duration in seconds
   * @returns The updated user data with ban status
   * @throws {TRPCError} If ban fails, user not found, or requester is unauthorized
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
   *
   * @param input - Unban data
   * @param input.userId - The ID of the user to unban
   * @returns The updated user data with ban status removed
   * @throws {TRPCError} If unban fails, user not found, or requester is unauthorized
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
   *
   * @param input - Query parameters
   * @param input.userId - The ID of the user to list sessions for
   * @returns Array of active sessions for the user
   * @throws {TRPCError} If query fails, user not found, or requester is unauthorized
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
   *
   * @param input - Revocation data
   * @param input.sessionToken - The session token to revoke
   * @returns Confirmation of session revocation
   * @throws {TRPCError} If revocation fails, session not found, or requester is unauthorized
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
   *
   * @param input - Revocation data
   * @param input.userId - The ID of the user whose sessions to revoke
   * @returns Confirmation of all sessions revocation
   * @throws {TRPCError} If revocation fails, user not found, or requester is unauthorized
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
