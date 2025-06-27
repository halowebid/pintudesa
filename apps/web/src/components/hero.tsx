import Image from "next/image"
import { Button } from "@pintudesa/ui"

const Hero = () => {
  return (
    <section className="relative flex min-h-[80vh] items-center py-12 sm:py-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        }}
      />
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center text-white lg:text-left">
            <h1 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-6xl">
              Selamat datang di
              <br className="hidden sm:block" />
              Website Profil Desa Sukarokok
            </h1>
            <p className="mb-8 text-base leading-relaxed text-gray-200 sm:text-lg lg:text-xl">
              Pintudesa Profil dengan teknologi terbaru serta memberikan
              informasi desa kami kepada masyarakat dengan berbagai profil Desa
              pelayanan Administrasi menjadi lebih mudah, Cepat dan Murah untuk
              keperluan warga.
            </p>
            <div className="mb-6">
              <p className="text-base font-semibold text-pink-400 sm:text-lg">
                Agistiadi Nugraha
              </p>
            </div>
            <Button
              size="lg"
              className="w-full bg-pink-500 px-8 py-3 text-white hover:bg-pink-600 sm:w-auto"
            >
              HUBUNGI KAMI
            </Button>
          </div>
          {/* Official Image */}
          <div className="mt-10 flex justify-center lg:mt-0 lg:justify-end">
            <div className="relative h-80 w-64 sm:h-96 sm:w-80">
              <Image
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&dpr=1"
                fill
                alt="Village Official"
                className="rounded-lg object-cover shadow-2xl"
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 500px"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
