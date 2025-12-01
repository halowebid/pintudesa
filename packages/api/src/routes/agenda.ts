import {
  countAgendas,
  deleteAgenda,
  getAgendaById,
  getAgendas,
  insertAgenda,
  insertAgendaSchema,
  searchAgendas,
  updateAgenda,
  updateAgendaSchema,
  type SelectAgenda,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  createTRPCRouter,
  publicProcedure,
  staffProtectedProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

/**
 * Agenda router for managing village agenda/schedule items
 * Requires staff authentication for mutations, public access for queries
 */
export const agendaRouter = createTRPCRouter({
  /**
   * Create a new agenda item
   *
   * @param input - Agenda data conforming to insertAgendaSchema
   * @returns The created agenda item
   * @throws {TRPCError} If creation fails or user is unauthorized
   */
  create: staffProtectedProcedure
    .input(insertAgendaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertAgenda(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Update an existing agenda item
   *
   * @param input - Agenda data with ID conforming to updateAgendaSchema
   * @returns The updated agenda item
   * @throws {TRPCError} If update fails, item not found, or user is unauthorized
   */
  update: staffProtectedProcedure
    .input(updateAgendaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateAgenda(input as SelectAgenda),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Delete an agenda item
   *
   * @param input - The agenda item ID to delete
   * @returns The deleted agenda item
   * @throws {TRPCError} If deletion fails, item not found, or user is unauthorized
   */
  delete: staffProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteAgenda(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get paginated list of all agenda items
   *
   * @param input - Pagination parameters
   * @param input.page - Page number (1-indexed)
   * @param input.perPage - Number of items per page
   * @returns Paginated array of agenda items
   * @throws {TRPCError} If query fails or user is unauthorized
   */
  all: staffProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getAgendas(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get a single agenda item by ID
   *
   * @param input - The agenda item ID
   * @returns The agenda item if found
   * @throws {TRPCError} If query fails, item not found, or user is unauthorized
   */
  byId: staffProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getAgendaById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  /**
   * Search agenda items by query string
   *
   * @param input - Search parameters
   * @param input.searchQuery - Search query string
   * @param input.limit - Maximum number of results to return
   * @returns Array of matching agenda items
   * @throws {TRPCError} If search fails
   */
  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchAgendas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get total count of agenda items
   *
   * @returns Total number of agenda items
   * @throws {TRPCError} If count query fails
   */
  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countAgendas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
