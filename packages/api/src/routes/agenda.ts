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
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const agendaRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertAgendaSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertAgenda(input))
      if (error) {
        handleTRPCError(error)
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
        handleTRPCError(error)
      }
      return data
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteAgenda(input))
      if (error) {
        handleTRPCError(error)
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
        handleTRPCError(error)
      }
      return data
    }),

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getAgendaById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  search: publicProcedure
    .input(z.object({ searchQuery: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(searchAgendas(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countAgendas())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
