import {
  countSuratTemplates,
  deleteSuratTemplate,
  generateR2Key,
  getDefaultTemplateForType,
  getR2PublicUrl,
  getSuratTemplateById,
  getSuratTemplates,
  insertSuratTemplate,
  insertSuratTemplateSchema,
  SURAT_TYPE_VALUES,
  updateSuratTemplate,
  updateSuratTemplateSchema,
  uploadFileToR2,
  type SelectSuratTemplate,
} from "@pintudesa/db"
import { tryCatch } from "@yopem/try-catch"
import mammoth from "mammoth"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { handleTRPCError } from "../utils/error"

export const suratTemplateRouter = createTRPCRouter({
  create: adminProtectedProcedure
    .input(insertSuratTemplateSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(insertSuratTemplate(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

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

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const { data, error } = await tryCatch(deleteSuratTemplate(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

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

  byId: adminProtectedProcedure.input(z.string()).query(async ({ input }) => {
    const { data, error } = await tryCatch(getSuratTemplateById(input))
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  bySuratType: adminProtectedProcedure
    .input(z.enum(SURAT_TYPE_VALUES))
    .query(async ({ input }) => {
      const { data, error } = await tryCatch(getDefaultTemplateForType(input))
      if (error) {
        handleTRPCError(error)
      }
      return data
    }),

  count: publicProcedure.query(async () => {
    const { data, error } = await tryCatch(countSuratTemplates())
    if (error) {
      handleTRPCError(error)
    }
    return data
  }),

  uploadWord: adminProtectedProcedure
    .input(
      z.object({
        fileData: z.string(),
        fileName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { data: html, error: parseError } = await tryCatch(
        mammoth.convertToHtml({
          buffer: Buffer.from(input.fileData, "base64"),
        }),
      )

      if (parseError) {
        throw parseError
      }

      const r2Key = generateR2Key("word-templates", input.fileName)

      const { error: uploadError } = await tryCatch(
        uploadFileToR2({
          file: Buffer.from(input.fileData, "base64"),
          fileName: r2Key,
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
      )

      if (uploadError) {
        throw uploadError
      }

      return {
        html: html.value,
        fileUrl: getR2PublicUrl(r2Key),
      }
    }),
})
