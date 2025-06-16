import { TRPCError } from "@trpc/server"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import {
  insertAgendaSchema,
  updateAgendaSchema,
  type SelectAgenda,
} from "@/lib/db/schema/agenda"
import {
  countAgendas,
  deleteAgenda,
  getAgendaById,
  getAgendas,
  insertAgenda,
  searchAgendas,
  updateAgenda,
} from "@/lib/db/service/agenda"

export const agendaRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertAgendaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertAgenda(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting agenda",
        })
      }
      return data
    }),

  update: adminProtectedProcedure
    .input(updateAgendaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateAgenda(input as SelectAgenda),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error inserting agenda",
        })
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteAgenda(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting agenda",
        })
      }
      return data
    }),

  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getAgendas(input.page, input.perPage),
      )
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching agendas",
        })
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getAgendaById(input))
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching agenda by ID",
      })
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchAgendas(input))
      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching agendas",
        })
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countAgendas())
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error counting agendas",
      })
    }
    return data
  }),
})
