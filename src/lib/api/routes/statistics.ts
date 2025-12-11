import { sql } from "drizzle-orm"

import { createTRPCRouter, publicProcedure } from "@/lib/api/trpc"
import { kartuKeluargaTable } from "@/lib/db/schema/kartu-keluarga"
import { pendudukTable } from "@/lib/db/schema/penduduk"

export const statisticsRouter = createTRPCRouter({
  /**
   * Retrieves summary statistics for the village.
   *
   * Includes total counts for:
   * - Residents (Penduduk)
   * - Families (Kartu Keluarga)
   * - Administrative units (Dusun, RW, RT)
   *
   * @returns Object containing total counts
   */
  getSummary: publicProcedure.query(async ({ ctx }) => {
    const [totalPenduduk] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(pendudukTable)
    const [totalKK] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(kartuKeluargaTable)

    const [totalDusun] = await ctx.db
      .select({ count: sql<number>`count(distinct ${pendudukTable.dusun})` })
      .from(pendudukTable)

    const [totalRW] = await ctx.db
      .select({ count: sql<number>`count(distinct ${pendudukTable.rw})` })
      .from(pendudukTable)

    const [totalRT] = await ctx.db
      .select({ count: sql<number>`count(distinct ${pendudukTable.rt})` })
      .from(pendudukTable)

    return {
      totalPenduduk: Number(totalPenduduk.count),
      totalKK: Number(totalKK.count),
      totalDusun: Number(totalDusun.count),
      totalRW: Number(totalRW.count),
      totalRT: Number(totalRT.count),
    }
  }),

  /**
   * Retrieves demographic statistics for the village.
   *
   * Aggregates data by:
   * - Gender (Jenis Kelamin)
   * - Education Level (Pendidikan Terakhir)
   * - Occupation (Pekerjaan) - Top 10
   * - Age Groups (calculated from Birth Date)
   *
   * @returns Object containing arrays of label/value pairs for each category
   */
  getDemographics: publicProcedure.query(async ({ ctx }) => {
    const genderStats = await ctx.db
      .select({
        label: pendudukTable.jenisKelamin,
        value: sql<number>`count(*)`,
      })
      .from(pendudukTable)
      .groupBy(pendudukTable.jenisKelamin)

    const educationStats = await ctx.db
      .select({
        label: pendudukTable.pendidikanTerakhir,
        value: sql<number>`count(*)`,
      })
      .from(pendudukTable)
      .groupBy(pendudukTable.pendidikanTerakhir)

    const occupationStats = await ctx.db
      .select({
        label: pendudukTable.pekerjaan,
        value: sql<number>`count(*)`,
      })
      .from(pendudukTable)
      .groupBy(pendudukTable.pekerjaan)
      .orderBy(sql`count(*) desc`)
      .limit(10)

    // Using Postgres specific date functions to bucket age groups
    const ageGroupsResult = await ctx.db.execute(sql`
      SELECT
        CASE
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '6 years' THEN 'Balita (0-5 Tahun)'
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '13 years' THEN 'Anak-anak (6-12 Tahun)'
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '18 years' THEN 'Remaja (13-17 Tahun)'
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '26 years' THEN 'Dewasa Muda (18-25 Tahun)'
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '36 years' THEN 'Dewasa (26-35 Tahun)'
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '46 years' THEN 'Dewasa Akhir (36-45 Tahun)'
          WHEN AGE(CURRENT_DATE, tanggal_lahir) < INTERVAL '56 years' THEN 'Lansia Awal (46-55 Tahun)'
          ELSE 'Lansia Akhir (56+ Tahun)'
        END as label,
        COUNT(*) as value
      FROM ${pendudukTable}
      GROUP BY label
    `)

    return {
      gender: genderStats.map((s) => ({
        label: s.label,
        value: Number(s.value),
      })),
      education: educationStats.map((s) => ({
        label: s.label,
        value: Number(s.value),
      })),
      occupation: occupationStats.map((s) => ({
        label: s.label,
        value: Number(s.value),
      })),
      ageGroups: ageGroupsResult.rows.map((s: unknown) => {
        const row = s as { label: string; value: number | string }
        return {
          label: row.label,
          value: Number(row.value),
        }
      }),
    }
  }),
})
