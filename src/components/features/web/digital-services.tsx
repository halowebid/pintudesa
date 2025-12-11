import Image from "next/image"
import { Icon } from "@yopem-ui/react-icons"

import { Button } from "@/components/ui/button"
import { createApi } from "@/lib/trpc/server"

const DigitalServices = async () => {
  const api = await createApi()

  const desa = await api.setting.byKey("desa")

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Mobile App Mockups */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300&h=600&dpr=1"
                width={300}
                height={600}
                alt="Mobile App"
                className="bg-muted h-auto w-64 rounded-3xl shadow-2xl grayscale transition-all duration-500"
              />
              <div className="absolute -top-8 -right-8 -z-10 h-auto w-48">
                <Image
                  src="https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=300&h=600&dpr=1"
                  width={300}
                  height={600}
                  alt="Mobile App 2"
                  className="bg-muted w-full rounded-3xl opacity-60 shadow-xl grayscale"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight lg:text-4xl">
              Pelayanan Administrasi Digital
            </h2>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Desa {desa} menggunakan aplikasi pelayanan online yang bernama{" "}
              <strong className="text-foreground">Pintudesa</strong>, aplikasi
              ini bisa diunduh dari aplikasi Play Store untuk pengguna Android
              dan dari App Store untuk pengguna iPhone.
            </p>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Beberapa fitur yang tersedia di aplikasi{" "}
              <strong className="text-foreground">Pintudesa</strong> seperti
              pembuatan surat, menyurat secara online, pengaduan, pengumuman
              desa, berita desa, galeri digital UMKM desa, cek bonitas, dan
              banyak lagi fitur lainnya. Aplikasi{" "}
              <strong className="text-foreground">Pintudesa</strong> dapat
              diunduh melalui tombol dibawah ini.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                <Icon name="Download" className="mr-2 size-5" />
                Download App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DigitalServices
