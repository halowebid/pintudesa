/**
 * Variable mappers for each surat type
 * Maps database records to template variables
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/dot-notation, no-console */

import type { SuratType } from "@pintudesa/db/schema"
import { formatDate } from "@pintudesa/utils"

/**
 * Common variables available in all surat templates
 */
interface CommonVariables {
  namaDesa: string
  kecamatan: string
  kabupaten: string
  provinsi: string

  tanggalSurat: string
  tahunSurat: string

  namaKepala: string
  nipKepala: string
}

/**
 * Gets common variables that are available in all templates
 */
export function getCommonVariables(setting?: {
  namaDesa?: string | null
  kecamatan?: string | null
  kabupatenKota?: string | null
  provinsi?: string | null
  namaKepala?: string | null
  nipKepala?: string | null
}): CommonVariables {
  const now = new Date()

  return {
    namaDesa: setting?.namaDesa ?? "Desa",
    kecamatan: setting?.kecamatan ?? "",
    kabupaten: setting?.kabupatenKota ?? "",
    provinsi: setting?.provinsi ?? "",
    tanggalSurat: formatDate(now, "LL"),
    tahunSurat: now.getFullYear().toString(),
    namaKepala: setting?.namaKepala ?? "",
    nipKepala: setting?.nipKepala ?? "",
  }
}

/**
 * Maps penduduk data to template variables
 */
function mapPendudukVariables(penduduk: any, prefix = "penduduk") {
  if (!penduduk) return {}

  return {
    [prefix]: {
      nik: penduduk.nik ?? "",
      namaLengkap: penduduk.namaLengkap ?? "",
      tempatLahir: penduduk.tempatLahir ?? "",
      tanggalLahir: penduduk.tanggalLahir
        ? formatDate(new Date(penduduk.tanggalLahir), "LL")
        : "",
      jenisKelamin: penduduk.jenisKelamin ?? "",
      agama: penduduk.agama ?? "",
      statusPerkawinan: penduduk.statusPerkawinan ?? "",
      pekerjaan: penduduk.pekerjaan ?? "",
      pendidikanTerakhir: penduduk.pendidikanTerakhir ?? "",
      alamat: penduduk.alamat ?? "",
      rt: penduduk.rt ?? "",
      rw: penduduk.rw ?? "",
      dusun: penduduk.dusun ?? "",
      desaKelurahan: penduduk.desa_kelurahan ?? "",
      kecamatan: penduduk.kecamatan ?? "",
      kabupatenKota: penduduk.kabupaten_kota ?? "",
      provinsi: penduduk.provinsi ?? "",
      kodePos: penduduk.kode_pos ?? "",
    },
  }
}

/**
 * Maps surat data to template variables based on surat type
 */
export function mapSuratVariables(
  suratType: SuratType,
  suratData: any,
  setting?: any,
): Record<string, unknown> {
  console.log("[mapSuratVariables] input:", { suratType, suratData, setting })

  const commonVars = getCommonVariables(setting)
  console.log("[mapSuratVariables] commonVars:", commonVars)

  const variables: Record<string, unknown> = {
    ...commonVars,
  }

  console.log("[mapSuratVariables] suratData.pemohon:", suratData.pemohon)
  if (suratData.pemohon) {
    const pemohonVars = mapPendudukVariables(suratData.pemohon, "pemohon")
    console.log("[mapSuratVariables] pemohonVars:", pemohonVars)
    Object.assign(variables, pemohonVars)
  } else {
    console.warn("[mapSuratVariables] No pemohon data found in suratData")
  }

  switch (suratType) {
    case "surat-keterangan-gaib":
      if (suratData.pasangan) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.pasangan, "pasangan"),
        )
      }
      if (suratData["tanggalDitinggal"]) {
        variables["tanggalDitinggal"] = formatDate(
          new Date(suratData["tanggalDitinggal"] as string),
          "LL",
        )
      }
      break

    case "surat-keterangan-domisili":
      variables["jumlahTahunDomisili"] = suratData["jumlahTahunDomisili"] ?? ""
      if (suratData.keluarga && Array.isArray(suratData.keluarga)) {
        variables["jumlahKeluarga"] = suratData.keluarga.length
      }
      break

    case "surat-keterangan-kelahiran":
      if (suratData.ayah) {
        Object.assign(variables, mapPendudukVariables(suratData.ayah, "ayah"))
      }
      if (suratData.ibu) {
        Object.assign(variables, mapPendudukVariables(suratData.ibu, "ibu"))
      }
      if (suratData.bayi) {
        Object.assign(variables, mapPendudukVariables(suratData.bayi, "bayi"))
      }
      if (suratData.saksi1) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.saksi1, "saksi1"),
        )
      }
      if (suratData.saksi2) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.saksi2, "saksi2"),
        )
      }
      if (suratData.pelapor) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.pelapor, "pelapor"),
        )
      }
      variables["jenisKelahiran"] = suratData["jenisKelahiran"] ?? ""
      variables["anakKe"] = suratData["anakKe"] ?? ""
      variables["penolongKelahiran"] = suratData["penolongKelahiran"] ?? ""
      variables["beratBayi"] = suratData["beratBayi"] ?? ""
      variables["panjangBayi"] = suratData["panjangBayi"] ?? ""
      break

    case "surat-keterangan-kematian":
      if (suratData.penduduk) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.penduduk, "yangMeninggal"),
        )
      }
      if (suratData.pelapor) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.pelapor, "pelapor"),
        )
      }
      if (suratData["tanggalMeninggal"]) {
        variables["tanggalMeninggal"] = formatDate(
          new Date(suratData["tanggalMeninggal"] as string),
          "LL",
        )
      }
      variables["jamMeninggal"] = suratData["jamMeninggal"] ?? ""
      variables["tempatMeninggal"] = suratData["tempatMeninggal"] ?? ""
      variables["penyebabKematian"] = suratData["penyebabKematian"] ?? ""
      break

    case "surat-izin-keramaian":
      variables["tujuanPembuatan"] = suratData["tujuanPembuatan"] ?? ""
      if (suratData["waktuAcara"]) {
        variables["waktuAcara"] = formatDate(
          new Date(suratData["waktuAcara"] as string),
          "LL",
        )
      }
      if (suratData["waktuSelesai"]) {
        variables["waktuSelesai"] = formatDate(
          new Date(suratData["waktuSelesai"] as string),
          "LL",
        )
      }
      break

    case "surat-izin-mendirikan-bangunan":
      variables["tujuanPembuatan"] = suratData["tujuanPembuatan"] ?? ""
      variables["lokasiPembangunan"] = suratData["lokasiPembangunan"] ?? ""
      break

    case "surat-keterangan-jalan":
      variables["tujuanPerjalanan"] = suratData["tujuanPerjalanan"] ?? ""
      variables["kotaTujuan"] = suratData["kotaTujuan"] ?? ""
      break

    case "surat-keterangan-kepemilikan-rumah":
      variables["alamatRumah"] = suratData["alamatRumah"] ?? ""
      variables["luasTanah"] = suratData["luasTanah"] ?? ""
      variables["luasBangunan"] = suratData["luasBangunan"] ?? ""
      break

    case "surat-keterangan-penghasilan":
      variables["penghasilan"] = suratData["penghasilan"] ?? ""
      break

    case "surat-keterangan-penghasilan-orang-tua":
      variables["penghasilanAyah"] = suratData["penghasilanAyah"] ?? ""
      variables["penghasilanIbu"] = suratData["penghasilanIbu"] ?? ""
      variables["namaAnak"] = suratData["namaAnak"] ?? ""
      break

    case "surat-keterangan-penyaksian-tanah":
      variables["lokasiTanah"] = suratData["lokasiTanah"] ?? ""
      variables["luasTanah"] = suratData["luasTanah"] ?? ""
      variables["batasTanah"] = suratData["batasTanah"] ?? ""
      break

    case "surat-kuasa-ahli-waris":
      if (suratData.pewaris) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.pewaris, "pewaris"),
        )
      }
      variables["hubungan"] = suratData["hubungan"] ?? ""
      break

    case "surat-kuasa-skgr":
      if (suratData.kuasaDari) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.kuasaDari, "kuasaDari"),
        )
      }
      variables["keperluan"] = suratData["keperluan"] ?? ""
      variables["lokasiTanah"] = suratData["lokasiTanah"] ?? ""
      break

    case "surat-pengantar-skck":
      variables["tujuanPembuatan"] = suratData["tujuanPembuatan"] ?? ""
      break

    case "surat-pernyataan-belum-menikah":
      if (suratData.saksi1) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.saksi1, "saksi1"),
        )
      }
      if (suratData.saksi2) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.saksi2, "saksi2"),
        )
      }
      break

    default:
      Object.entries(suratData).forEach(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          variables[key] = value
        }
      })
  }

  return variables
}
