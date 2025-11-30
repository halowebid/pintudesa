"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { createListCollection, type ListCollection } from "@ark-ui/react"
import {
  AGAMA,
  ASAL_PENDUDUK,
  JENIS_KELAMIN,
  JENIS_PEKERJAAN,
  KATEGORI_PENDUDUK,
  PENDIDIKAN_TERAKHIR,
  SHDK,
  STATUS_DOMISILI,
  STATUS_PERKAWINAN,
} from "@pintudesa/db/schema"
import {
  Button,
  ComboboxPopover,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValueText,
} from "@pintudesa/ui"
import { formatStringToDate } from "@pintudesa/utils"
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { Icon } from "@yopem-ui/react-icons"
import dayjs from "dayjs"
import { z } from "zod"

import { useAppForm } from "@/components/form"
import { FormAnggotaKeluargaDialog } from "@/components/form-dialog/form-anggota-keluarga-keluarga"
import { useToast } from "@/components/toast-provider"
import { useTRPC } from "@/lib/trpc/client"
import { useHandleTRPCError } from "@/lib/utils/error"

const dateFlexible = z
  .union([z.string(), z.date()])
  .refine(
    (val) => {
      if (typeof val === "string") {
        return dayjs(val, "DD/MM/YYYY", true).isValid()
      }
      return val instanceof Date && !isNaN(val.getTime())
    },
    {
      message: "Tanggal tidak valid, harus format MM/DD/YYYY",
    },
  )
  .transform((val) => {
    if (typeof val === "string") {
      return dayjs(val, "DD/MM/YYYY").toDate()
    }
    return val
  })

const pendudukSchema = z.object({
  id: z.string().optional(),
  anggotaKeluargaId: z.string().optional(),
  kartuKeluargaId: z.string().optional(),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggalLahir: dateFlexible,
  jenisKelamin: z.enum(JENIS_KELAMIN),
  agama: z.enum(AGAMA),
  pendidikanTerakhir: z.enum(PENDIDIKAN_TERAKHIR),
  pekerjaan: z.enum(JENIS_PEKERJAAN),
  statusPerkawinan: z.enum(STATUS_PERKAWINAN),
  statusDomisili: z.enum(STATUS_DOMISILI),
  asalPenduduk: z.enum(ASAL_PENDUDUK),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  provinsi: z.string().min(1, "Provinsi wajib diisi"),
  kabupaten_kota: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  desa_kelurahan: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  dusun: z.string().optional(),
  namaAyahKandung: z.string().min(1, "Nama ayah kandung wajib diisi"),
  namaIbuKandung: z.string().min(1, "Nama ibu kandung wajib diisi"),
  bantuanSosial: z.boolean().optional().default(false),
  disabilitas: z.boolean().optional().default(false),
  shdk: z.enum(SHDK, {
    errorMap: () => ({ message: "SHDK wajib dipilih" }),
  }),
})
const kartuKeluargaSchema = z.object({
  id: z.string().optional(),
  kategoriPenduduk: z.enum(KATEGORI_PENDUDUK).default("penduduk_dalam_desa"),
  nomorKartuKeluarga: z.string().min(1, "Nomor KK wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  rt: z.string().min(1, "RT wajib diisi"),
  rw: z.string().min(1, "RW wajib diisi"),
  provisi: z.string().min(1, "Provinsi wajib diisi"),
  kabupaten_kota: z.string().min(1, "Kabupaten/Kota wajib diisi"),
  kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
  desa_kelurahan: z.string().min(1, "Desa/Kelurahan wajib diisi"),
  dusun: z.string().optional(),
})

const combinedSchema = z.object({
  kartuKeluarga: kartuKeluargaSchema,
  kepalaKeluarga: pendudukSchema,
})

const defaultValues: z.input<typeof combinedSchema> = {
  kartuKeluarga: {
    kategoriPenduduk: "penduduk_dalam_desa",
    nomorKartuKeluarga: "",
    alamat: "",
    rt: "",
    rw: "",
    provisi: "",
    kabupaten_kota: "",
    kecamatan: "",
    desa_kelurahan: "",
    dusun: "",
  },

  kepalaKeluarga: {
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: new Date(),
    jenisKelamin: "laki-laki",
    agama: "islam",
    pendidikanTerakhir: "tidak_atau_belum_sekolah",
    pekerjaan: "lainnya",
    statusPerkawinan: "belum_kawin",
    statusDomisili: "ktp_beralamat_di_desa_berdomisili_di_desa",
    asalPenduduk: "penduduk_desa",
    alamat: "",
    rt: "",
    rw: "",
    provinsi: "",
    kabupaten_kota: "",
    kecamatan: "",
    desa_kelurahan: "",
    dusun: "",
    namaAyahKandung: "",
    namaIbuKandung: "",
    bantuanSosial: false,
    disabilitas: false,
    shdk: "kepala_keluarga",
  },
}

interface SelectedPenduduk
  extends Omit<z.infer<typeof pendudukSchema>, "shdk"> {
  label: string
  value: string
}
export default function PendudukForm({
  id,
  isDialog,
}: {
  id: string
  isDialog: boolean
}) {
  type Anggota = z.infer<typeof pendudukSchema>

  const [anggotaList, setAnggotaList] = React.useState<Anggota[]>([])

  const [showEditAnggotaModal, setShowEditAnggotaModal] = React.useState(false)
  const [editingAnggotaIndex, setEditingAnggotaIndex] = React.useState<
    number | null
  >(null)
  const [isEditingKepalaKeluarga, setIsEditingKepalaKeluarga] =
    React.useState(false)
  const [isDialogSubmitting, setIsDialogSubmitting] = React.useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = React.useState(false)
  const [selectedAnggota, setSelectedAnggota] =
    React.useState<SelectedPenduduk | null>(null)
  const [anggotaSearchKey, setAnggotaSearchKey] = React.useState("")
  const [selectedShdk, setSelectedShdk] = React.useState<SHDK | "">("")
  const { toast } = useToast()
  const handleError = useHandleTRPCError()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const kartuKeluargasKey = trpc.kartuKeluarga.all.queryKey()
  const kartuKeluargasByIdKey = trpc.kartuKeluarga.byId.queryKey(id)
  const invalidateKartuKeluargasByIdKey = async () =>
    await queryClient.invalidateQueries({ queryKey: kartuKeluargasByIdKey })
  const invalidateKartuKeluargasKey = async () =>
    await queryClient.invalidateQueries({ queryKey: kartuKeluargasKey })

  const { data: initialKartuKeluargaData, isLoading: isLoadingKK } = useQuery(
    trpc.kartuKeluarga.byId.queryOptions(id),
  )

  const { data: anggotaSearchResults = [] } = useQuery(
    trpc.penduduk.search.queryOptions(
      { searchQuery: anggotaSearchKey, limit: 10 },
      { enabled: !!anggotaSearchKey },
    ),
  )
  const anggotaPendudukOptionsRaw = React.useMemo(() => {
    return anggotaSearchResults.map((p) => ({
      ...p,
      label: `${p.nik} (${p.namaLengkap})`,
      value: p.id,
    }))
  }, [anggotaSearchResults])

  const anggotaPendudukOptions = React.useMemo(
    () =>
      anggotaPendudukOptionsRaw.map(({ label, value }) => ({ label, value })),
    [anggotaPendudukOptionsRaw],
  )

  const shdkOptions = SHDK.filter((s) => s !== "kepala_keluarga").map(
    (item) => ({
      label: item.replace(/_/g, " ").toUpperCase(),
      value: item,
    }),
  )

  const shdkCollection: ListCollection = createListCollection({
    items: shdkOptions,
  })

  const anggotaKeluargaRelations = React.useMemo(
    () => initialKartuKeluargaData?.anggotaKeluarga ?? [],
    [initialKartuKeluargaData],
  )

  const pendudukQueries = React.useMemo(
    () =>
      anggotaKeluargaRelations.map((anggota) =>
        trpc.penduduk.byId.queryOptions(anggota.pendudukId, {
          enabled: !!anggota.pendudukId,
        }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anggotaKeluargaRelations],
  )

  const combinedPenduduk = useQueries({
    queries: pendudukQueries,
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        isPending: results.some((result) => result.isPending),
        isError: results.some((result) => result.isError),
      }
    },
  })

  const { mutateAsync: updateKartuKeluarga } = useMutation(
    trpc.kartuKeluarga.update.mutationOptions({
      onError: (e) => handleError(e, "Gagal update KK"),
    }),
  )
  const { mutateAsync: updatePenduduk } = useMutation(
    trpc.penduduk.update.mutationOptions({
      onError: (e) => handleError(e, "Gagal update penduduk"),
    }),
  )
  const { mutateAsync: updateAnggotaKeluarga } = useMutation(
    trpc.anggotaKeluarga.update.mutationOptions({
      onError: (e) => handleError(e, "Gagal update relasi anggota"),
    }),
  )

  const { mutateAsync: createAnggotaKeluarga } = useMutation(
    trpc.anggotaKeluarga.create.mutationOptions({
      onError: (e) => handleError(e, "Gagal membuat relasi anggota baru"),
    }),
  )

  const initialFormData = React.useMemo(() => {
    if (
      isLoadingKK ||
      combinedPenduduk.isPending ||
      !initialKartuKeluargaData
    ) {
      return null
    }

    const stitchedAnggotaData = anggotaKeluargaRelations
      .map((relasi) => {
        const pendudukDetail = combinedPenduduk.data.find(
          (penduduk) => penduduk && penduduk.id === relasi.pendudukId,
        )

        if (!pendudukDetail) {
          // eslint-disable-next-line no-console
          console.warn(
            `Data penduduk untuk pendudukId ${relasi.pendudukId} tidak ditemukan.`,
          )
          return null
        }

        const combinedData = {
          ...pendudukDetail,
          shdk: relasi.shdk,
          anggotaKeluargaId: relasi.id,
        }

        const parseResult = pendudukSchema.safeParse(combinedData)
        if (!parseResult.success) {
          // eslint-disable-next-line no-console
          console.error(
            `Validasi Zod gagal untuk NIK ${pendudukDetail.nik}:`,
            parseResult.error.flatten().fieldErrors,
          )
          return null
        }

        return parseResult.data
      })
      .filter((item): item is Anggota => item !== null)

    const kepalaKeluarga = stitchedAnggotaData.find(
      (a) => a.shdk === "kepala_keluarga",
    )

    const initialAnggotaLain = stitchedAnggotaData.filter(
      (anggota) => anggota.shdk !== "kepala_keluarga",
    )

    return {
      formData: {
        kartuKeluarga: {
          ...initialKartuKeluargaData,
          id: initialKartuKeluargaData.id,
          kategoriPenduduk:
            initialKartuKeluargaData.kategoriPenduduk ?? "penduduk_dalam_desa",
          dusun: initialKartuKeluargaData.dusun ?? "",
        },
        kepalaKeluarga: kepalaKeluarga ?? defaultValues.kepalaKeluarga,
      },
      initialAnggotaList: initialAnggotaLain,
    }
  }, [
    isLoadingKK,
    combinedPenduduk.isPending,
    combinedPenduduk.data,
    initialKartuKeluargaData,
    anggotaKeluargaRelations,
  ])

  const handleCreateAnggotaList = React.useCallback(
    async (kartuKeluargaId: string) => {
      await Promise.all(
        anggotaList.map(async (anggota) => {
          if (!anggota.id) {
            throw new Error(
              `Anggota keluarga ${anggota.namaLengkap} tidak memiliki ID penduduk.`,
            )
          }
          if (anggota.anggotaKeluargaId) {
            toast({
              title: "Anggota Sudah Terdaftar",
              description: `${anggota.namaLengkap} sudah menjadi anggota keluarga atau terdaftar di kartu keluarga lain.`,
            })
            return
          }
          await createAnggotaKeluarga({
            ...anggota,
            pendudukId: anggota.id,
            kartuKeluargaId: kartuKeluargaId,
          })
        }),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anggotaList, createAnggotaKeluarga],
  )
  const form = useAppForm({
    defaultValues: initialFormData ? initialFormData.formData : defaultValues,
    validators: {
      onChange: combinedSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.kartuKeluarga.id) {
        toast({
          title: "Validasi Gagal",
          description: "Anda harus memilih seorang Kepala Keluarga.",
        })
        return
      }
      setIsFormSubmitting(true)
      try {
        const updateKKPromise = updateKartuKeluarga({
          id: value.kartuKeluarga.id,
          ...value.kartuKeluarga,
        })

        const updateKepalaKeluargaPromise = updatePenduduk({
          id: value.kepalaKeluarga.id,
          ...value.kepalaKeluarga,
          tanggalLahir: formatStringToDate(value.kepalaKeluarga.tanggalLahir),
        })
        if (anggotaList.length > 0) {
          await handleCreateAnggotaList(value.kartuKeluarga.id)
        }

        await Promise.all([updateKKPromise, updateKepalaKeluargaPromise])

        toast({ description: "Data Kartu Keluarga berhasil diperbarui." })
        await invalidateKartuKeluargasKey()
        await invalidateKartuKeluargasByIdKey()
        if (isDialog) router.back()
        else router.push("/kartu-keluarga")
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Gagal submit:", error)
      } finally {
        setIsFormSubmitting(false)
      }
    },
  })

  const handleAddAnggota = () => {
    if (!selectedAnggota || !selectedShdk) {
      toast({
        title: "Gagal Menambah",
        description: "Silakan cari penduduk dan pilih SHDK terlebih dahulu.",
      })
      return
    }

    if (selectedAnggota.id === initialFormData?.formData.kepalaKeluarga.id) {
      toast({
        title: "Gagal Menambah",
        description: "Penduduk ini sudah dipilih sebagai Kepala Keluarga.",
      })
      return
    }

    const isAlreadyInList = anggotaList.some(
      (anggota) => anggota.id === selectedAnggota.id,
    )
    if (isAlreadyInList) {
      toast({
        title: "Gagal Menambah",
        description: "Penduduk ini sudah ada di dalam daftar anggota.",
      })
      return
    }

    const newAnggota = {
      ...selectedAnggota,
      shdk: selectedShdk,
    }
    setAnggotaList((prev) => [...prev, newAnggota])

    setSelectedAnggota(null)
    setSelectedShdk("")
    setAnggotaSearchKey("")
  }

  const handleEditClick = React.useCallback((index: number) => {
    setEditingAnggotaIndex(index)
    setShowEditAnggotaModal(true)
  }, [])

  const handleCancelEditKepalaKeluarga = () => {
    setIsEditingKepalaKeluarga(false)
  }
  React.useEffect(() => {
    if (initialFormData?.initialAnggotaList && anggotaList.length === 0) {
      setAnggotaList(initialFormData.initialAnggotaList)
    }
  }, [initialFormData?.initialAnggotaList, anggotaList.length])
  if (!initialFormData) {
    return <div>Mempersiapkan form...</div>
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className="max-w-md space-y-6"
      >
        <section className="space-y-6 p-4">
          <h2 className="mb-4 text-lg font-semibold">Kartu Keluarga</h2>

          <form.AppField name="kartuKeluarga.kategoriPenduduk">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Kategori Penduduk</form.FormLabel>
                <field.SelectField
                  mode={isDialog ? "inline" : "portal"}
                  options={KATEGORI_PENDUDUK.map((item) => ({
                    label: item
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    value: item,
                  }))}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.AppField name="kartuKeluarga.nomorKartuKeluarga">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Nomor Kartu Keluarga</form.FormLabel>
                <field.BaseField placeholder="Masukkan nomor KK" />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.AppField name="kartuKeluarga.alamat">
            {(field) => (
              <form.FormItem>
                <form.FormLabel>Alamat</form.FormLabel>
                <field.TextareaField
                  placeholder="Masukkan alamat lengkap"
                  disabled={!isEditingKepalaKeluarga}
                />
                <form.FormMessage />
              </form.FormItem>
            )}
          </form.AppField>
          <form.Subscribe
            selector={(state) => [state.values.kartuKeluarga.kategoriPenduduk]}
          >
            {([asalPenduduk]) => {
              const showAlamatLuar =
                asalPenduduk === "penduduk_luar_desa" ||
                asalPenduduk === "penduduk_luar_berdomisili_di_desa"

              const showAlamatDomisili =
                asalPenduduk === "penduduk_dalam_desa" ||
                asalPenduduk === "penduduk_luar_berdomisili_di_desa"

              return (
                <>
                  {showAlamatLuar && (
                    <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
                      <form.AppField name="kartuKeluarga.provisi">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Provinsi</form.FormLabel>
                            <field.BaseField placeholder="Pilih Provinsi" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                      <form.AppField name="kartuKeluarga.kabupaten_kota">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Kabupaten / Kota</form.FormLabel>
                            <field.BaseField placeholder="Pilih Kabupaten/Kota" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                      <form.AppField name="kartuKeluarga.kecamatan">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Kecamatan</form.FormLabel>
                            <field.BaseField placeholder="Pilih Kecamatan" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                      <form.AppField name="kartuKeluarga.desa_kelurahan">
                        {(field) => (
                          <form.FormItem>
                            <form.FormLabel>Desa / Kelurahan</form.FormLabel>
                            <field.BaseField placeholder="Pilih Kelurahan / Desa" />
                            <form.FormMessage />
                          </form.FormItem>
                        )}
                      </form.AppField>
                    </div>
                  )}

                  {showAlamatDomisili && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-md font-semibold text-gray-700">
                        Data Domisili saat ini
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <form.AppField name="kartuKeluarga.dusun">
                          {(field) => (
                            <form.FormItem>
                              <form.FormLabel>Dusun</form.FormLabel>
                              <field.BaseField placeholder="Pilih Dusun" />
                              <form.FormMessage />
                            </form.FormItem>
                          )}
                        </form.AppField>
                        <form.AppField name="kartuKeluarga.rw">
                          {(field) => (
                            <form.FormItem>
                              <form.FormLabel>RW</form.FormLabel>
                              <field.BaseField
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Pilih RW"
                              />
                              <form.FormMessage />
                            </form.FormItem>
                          )}
                        </form.AppField>
                        <form.AppField name="kartuKeluarga.rt">
                          {(field) => (
                            <form.FormItem>
                              <form.FormLabel>RT</form.FormLabel>
                              <field.BaseField
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Pilih RT"
                              />
                              <form.FormMessage />
                            </form.FormItem>
                          )}
                        </form.AppField>
                      </div>
                    </div>
                  )}
                </>
              )
            }}
          </form.Subscribe>
        </section>

        <section className="mt-8 space-y-6 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Kepala Keluarga</h2>
            {isEditingKepalaKeluarga ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEditKepalaKeluarga}
              >
                Batal Edit
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => setIsEditingKepalaKeluarga(true)}
              >
                Edit Data
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <form.AppField name="kepalaKeluarga.namaLengkap">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Nama Lengkap</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan nama lengkap"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.nik">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>NIK</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan NIK"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.tempatLahir">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Tempat Lahir</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan tempat lahir"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.tanggalLahir">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Tanggal Lahir</form.FormLabel>
                  <field.DatePickerField
                    mode={isDialog ? "inline" : "portal"}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.jenisKelamin">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Jenis Kelamin</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={[
                      { label: "Laki-laki", value: "laki-laki" },
                      { label: "Perempuan", value: "perempuan" },
                    ]}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.agama">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Agama</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={AGAMA.map((item) => ({
                      label: item.replace(/_/g, " ").toUpperCase(),
                      value: item,
                    }))}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.pendidikanTerakhir">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Pendidikan Terakhir</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={PENDIDIKAN_TERAKHIR.map((item) => ({
                      label: item.replace(/_/g, " ").toUpperCase(),
                      value: item,
                    }))}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.pekerjaan">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Pekerjaan</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={JENIS_PEKERJAAN.map((item) => ({
                      label: item.replace(/_/g, " ").toUpperCase(),
                      value: item,
                    }))}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.statusPerkawinan">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Status Perkawinan</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={STATUS_PERKAWINAN.map((item) => ({
                      label: item.replace(/_/g, " ").toUpperCase(),
                      value: item,
                    }))}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.statusDomisili">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Status Domisili</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={STATUS_DOMISILI.map((item) => ({
                      label: item.replace(/_/g, " ").toUpperCase(),
                      value: item,
                    }))}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.asalPenduduk">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Asal Penduduk</form.FormLabel>
                  <field.SelectField
                    mode={isDialog ? "inline" : "portal"}
                    options={ASAL_PENDUDUK.map((item) => ({
                      label: item.replace(/_/g, " ").toUpperCase(),
                      value: item,
                    }))}
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.alamat">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Alamat</form.FormLabel>
                  <field.TextareaField
                    placeholder="Masukkan alamat lengkap"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.rt">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>RT</form.FormLabel>
                  <field.BaseField
                    placeholder="Contoh: 01"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.rw">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>RW</form.FormLabel>
                  <field.BaseField
                    placeholder="Contoh: 02"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.provinsi">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Provinsi</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan provinsi"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.kabupaten_kota">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Kabupaten/Kota</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan kabupaten atau kota"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.kecamatan">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Kecamatan</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan kecamatan"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.desa_kelurahan">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Desa/Kelurahan</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan desa atau kelurahan"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.dusun">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Dusun</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan dusun (opsional)"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.namaAyahKandung">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Nama Ayah Kandung</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan nama ayah"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.namaIbuKandung">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Nama Ibu Kandung</form.FormLabel>
                  <field.BaseField
                    placeholder="Masukkan nama ibu"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.bantuanSosial">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Bantuan Sosial</form.FormLabel>
                  <field.CheckboxField
                    label="Menerima bantuan sosial"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>

            <form.AppField name="kepalaKeluarga.disabilitas">
              {(field) => (
                <form.FormItem>
                  <form.FormLabel>Disabilitas</form.FormLabel>
                  <field.CheckboxField
                    label="Memiliki disabilitas"
                    disabled={!isEditingKepalaKeluarga}
                  />
                  <form.FormMessage />
                </form.FormItem>
              )}
            </form.AppField>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Anggota Keluarga</h2>
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-md font-medium">Cari dan Tambah Anggota</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cari Penduduk</label>
              <ComboboxPopover
                mode={isDialog ? "inline" : "portal"}
                selectedLabel={selectedAnggota?.label}
                onInputValueChange={setAnggotaSearchKey}
                onValueChange={(val) => {
                  const selected = anggotaPendudukOptionsRaw.find(
                    (p) => p.value === val,
                  )
                  if (selected)
                    setSelectedAnggota({
                      ...selected,
                      asalPenduduk: selected.asalPenduduk ?? "penduduk_desa",
                      dusun: selected.dusun ?? "",
                    })
                }}
                isClearable={true}
                onClear={() => setSelectedAnggota(null)}
                items={anggotaPendudukOptions}
                placeholder="Cari NIK atau Nama penduduk..."
                value={selectedAnggota?.value}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Status Hubungan Dalam Keluarga (SHDK)
              </label>

              <Select
                collection={shdkCollection}
                value={selectedShdk ? [selectedShdk] : []}
                onValueChange={(e) => {
                  const newValue = e.value[0] ?? ""
                  setSelectedShdk(newValue as SHDK | "")
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValueText placeholder="Pilih SHDK" />
                </SelectTrigger>
                <SelectContent mode={isDialog ? "inline" : "portal"}>
                  <SelectItemGroup>
                    {shdkCollection.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectItemGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={handleAddAnggota}>
              <Icon name="Plus" className="mr-2" />
              Tambah ke Daftar
            </Button>
          </div>

          {anggotaList.length > 0 && (
            <ul className="divide-mute divide-y rounded-md border">
              {anggotaList.map((anggota, index) => {
                if (anggota.shdk !== "kepala_keluarga") {
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="text-sm">
                        <p className="font-medium">{anggota.namaLengkap}</p>
                        <p className="text-muted-foreground">
                          {anggota.nik} -{" "}
                          {anggota.shdk.replace(/_/g, " ").toUpperCase()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(index)}
                        >
                          Edit
                        </Button>
                      </div>
                    </li>
                  )
                }
                return null
              })}
            </ul>
          )}
        </section>

        <form.FormItem>
          <Button type="submit" disabled={isFormSubmitting}>
            {isFormSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form.FormItem>
      </form>

      {editingAnggotaIndex !== null && (
        <FormAnggotaKeluargaDialog
          mode="edit"
          open={showEditAnggotaModal}
          isSubmitting={isDialogSubmitting}
          onClose={() => {
            if (isDialogSubmitting) return
            setShowEditAnggotaModal(false)
            setEditingAnggotaIndex(null)
          }}
          onSubmit={async (editedAnggota) => {
            setIsDialogSubmitting(true)
            const originalAnggota = anggotaList[editingAnggotaIndex]
            if (!originalAnggota.id || !originalAnggota.anggotaKeluargaId) {
              toast({
                description: "Data anggota tidak lengkap.",
              })
              setIsDialogSubmitting(false)
              return
            }
            try {
              const { shdk, ...pendudukData } = editedAnggota
              await Promise.all([
                updatePenduduk({ id: originalAnggota.id, ...pendudukData }),
                updateAnggotaKeluarga({
                  id: originalAnggota.anggotaKeluargaId,
                  shdk,
                }),
              ])
              setAnggotaList((prev) =>
                prev.map((item, index) =>
                  index === editingAnggotaIndex
                    ? { ...item, ...editedAnggota }
                    : item,
                ),
              )
              toast({ description: "Data anggota berhasil diperbarui." })
              setShowEditAnggotaModal(false)
              setEditingAnggotaIndex(null)
            } catch {
              toast({ description: "Data anggota gagal diperbarui." })
            } finally {
              setIsDialogSubmitting(false)
            }
          }}
          initialValues={anggotaList[editingAnggotaIndex]}
          defaultValues={defaultValues.kepalaKeluarga}
        />
      )}
    </div>
  )
}
