/**
 * Variable mappers for each surat type
 * Maps database records to template variables
 */

import type { SuratType } from "@pintudesa/db/schema"
import { formatDate } from "@pintudesa/utils"

/**
 * Common variables available in all surat templates
 */
interface CommonVariables {
  // Desa information
  namaDesa: string
  kecamatan: string
  kabupaten: string
  provinsi: string

  // Current date/time
  tanggalSurat: string
  tahunSurat: string

  // Officer information (kepala desa, sekretaris, etc)
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
    tanggalSurat: formatDate(now, "PPP"),
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
    [`${prefix}.nik`]: penduduk.nik ?? "",
    [`${prefix}.namaLengkap`]: penduduk.namaLengkap ?? "",
    [`${prefix}.tempatLahir`]: penduduk.tempatLahir ?? "",
    [`${prefix}.tanggalLahir`]: penduduk.tanggalLahir
      ? formatDate(new Date(penduduk.tanggalLahir), "PPP")
      : "",
    [`${prefix}.jenisKelamin`]: penduduk.jenisKelamin ?? "",
    [`${prefix}.agama`]: penduduk.agama ?? "",
    [`${prefix}.statusPerkawinan`]: penduduk.statusPerkawinan ?? "",
    [`${prefix}.pekerjaan`]: penduduk.pekerjaan ?? "",
    [`${prefix}.pendidikanTerakhir`]: penduduk.pendidikanTerakhir ?? "",
    [`${prefix}.alamat`]: penduduk.alamat ?? "",
    [`${prefix}.rt`]: penduduk.rt ?? "",
    [`${prefix}.rw`]: penduduk.rw ?? "",
    [`${prefix}.dusun`]: penduduk.dusun ?? "",
    [`${prefix}.desaKelurahan`]: penduduk.desa_kelurahan ?? "",
    [`${prefix}.kecamatan`]: penduduk.kecamatan ?? "",
    [`${prefix}.kabupatenKota`]: penduduk.kabupaten_kota ?? "",
    [`${prefix}.provinsi`]: penduduk.provinsi ?? "",
    [`${prefix}.kodePos`]: penduduk.kode_pos ?? "",
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
  const commonVars = getCommonVariables(setting)

  // Base variables
  const variables: Record<string, unknown> = {
    ...commonVars,
  }

  // Map pemohon (applicant) if available
  if (suratData.pemohonNIK) {
    Object.assign(
      variables,
      mapPendudukVariables(suratData.pemohonNIK, "pemohon"),
    )
  }

  // Type-specific mappings
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
          "PPP",
        )
      }
      break

    case "surat-keterangan-domisili":
      variables["jumlahTahunDomisili"] = suratData["jumlahTahunDomisili"] ?? ""
      // Add keluarga members if available
      if (suratData.keluarga && Array.isArray(suratData.keluarga)) {
        variables["jumlahKeluarga"] = suratData.keluarga.length
        // You can add keluarga list rendering here if needed
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
      if (suratData.yangMeninggal) {
        Object.assign(
          variables,
          mapPendudukVariables(suratData.yangMeninggal, "yangMeninggal"),
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
          "PPP",
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
          "PPP",
        )
      }
      if (suratData["waktuSelesai"]) {
        variables["waktuSelesai"] = formatDate(
          new Date(suratData["waktuSelesai"] as string),
          "PPP",
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

    // Add more cases for other surat types as needed
    default:
      // For surat types without specific mapping, just spread all data
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
