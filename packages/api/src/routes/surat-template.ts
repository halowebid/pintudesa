import {
  countSuratTemplates,
  deleteSuratTemplate,
  getDefaultTemplateForType,
  getSuratTemplateById,
  getSuratTemplates,
  insertSuratTemplate,
  insertSuratTemplateSchema,
  SURAT_TYPE_VALUES,
  updateSuratTemplate,
  updateSuratTemplateSchema,
  type SelectSuratTemplate,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratTemplateRouter = createTRPCRouter({
  /**
   * Create a new surat template
   */
  create: adminProtectedProcedure
    .input(insertSuratTemplateSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratTemplate(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Update an existing surat template
   */
  update: adminProtectedProcedure
    .input(updateSuratTemplateSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(
        updateSuratTemplate(input as SelectSuratTemplate),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Delete a surat template
   */
  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratTemplate(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get paginated list of all surat templates
   */
  all: adminProtectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(
        getSuratTemplates(input.page, input.perPage),
      )
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get a single surat template by ID
   */
  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratTemplateById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  /**
   * Get the default template for a specific surat type
   */
  bySuratType: adminProtectedProcedure
    .input(z.enum(SURAT_TYPE_VALUES))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getDefaultTemplateForType(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  /**
   * Get total count of surat templates
   */
  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratTemplates())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),
})
