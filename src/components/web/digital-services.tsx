import Image from "next/image"
import { Icon } from "@yopem-ui/react-icons"

import { createApi } from "@/lib/trpc/server"
import { Button } from "@/lib/ui"

const DigitalServices = async () => {
  const api = await createApi()

  const desa = await api.setting.byKey("desa")

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Mobile App Mockups */}
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300&h=600&dpr=1"
                width={300}
                height={600}
                alt="Mobile App"
                className="h-auto w-64 rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-8 -right-8 h-auto w-48">
                <Image
                  src="https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=300&h=600&dpr=1"
                  width={300}
                  height={600}
                  alt="Mobile App 2"
                  className="w-full rounded-3xl opacity-80 shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-foreground mb-6 text-3xl font-bold lg:text-4xl">
              Pelayanan Administrasi Digital
            </h2>
            <p className="text-accent-foreground mb-6 text-lg leading-relaxed">
              Desa {desa} menggunakan aplikasi pelayanan online yang bernama{" "}
              <strong>Pintudesa</strong>, aplikasi ini bisa diunduh dari
              aplikasi Play Store untuk pengguna Android dan dari App Store
              untuk pengguna iPhone.
            </p>
            <p className="text-accent-foreground mb-8 text-lg leading-relaxed">
              Beberapa fitur yang tersedia di aplikasi{" "}
              <strong>Pintudesa</strong> seperti pembuatan surat, menyurat
              secara online, pengaduan, pengumuman desa, berita desa, galeri
              digital UMKM desa, cek bonitas, dan banyak lagi fitur lainnya.
              Aplikasi <strong>Pintudesa</strong> dapat diunduh melalui tombol
              dibawah ini.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="outline">
                <Icon name="Download" className="mr-2 size-5" />
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DigitalServices
