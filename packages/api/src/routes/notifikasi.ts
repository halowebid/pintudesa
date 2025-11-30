import {
  createNotifikasi,
  deleteNotifikasi,
  getNotifikasiById,
  getNotifikasiByUser,
  getUnreadCount,
  insertNotifikasiSchema,
  markAllAsRead,
  markAsRead,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../trpc"
import { handleTRPCError } from "../utils/error"

/**
 * Notification router
 * All procedures require authentication and scope data to the current user
 */
export const notifikasiRouter = createTRPCRouter({
  /**
   * Get paginated notifications for the current user
   * Optionally filter by unread status
   */
  myNotifications: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        perPage: z.number().default(10),
        unreadOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        getNotifikasiByUser(
          ctx.session.user.id,
          input.page,
          input.perPage,
          input.unreadOnly,
        ),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get count of unread notifications for the current user
   */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await tryCatch(getUnreadCount(ctx.session.user.id))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  /**
   * Get a single notification by ID
   * User ownership is verified in the service layer
   */
  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { data, error } = await tryCatch(
      getNotifikasiById(input, ctx.session.user.id),
    )
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  /**
   * Mark a notification as read
   * User ownership is verified in the service layer
   */
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        markAsRead(input.id, ctx.session.user.id),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Mark all notifications as read for the current user
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const { data, error } = await tryCatch(markAllAsRead(ctx.session.user.id))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  /**
   * Delete a notification
   * User ownership is verified in the service layer
   */
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        deleteNotifikasi(input, ctx.session.user.id),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Create a notification (for testing purposes)
   * In production, this would be called by system events
   */
  create: protectedProcedure
    .input(insertNotifikasiSchema.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await tryCatch(
        createNotifikasi(ctx.session.user.id, input),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),
})
