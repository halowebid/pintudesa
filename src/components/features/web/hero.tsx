import Image from "next/image"

import { Button } from "@/components/ui/button"
import Link from "@/components/ui/link"
import { createApi } from "@/lib/trpc/server"

const Hero = async () => {
  const api = await createApi()

  const title = await api.setting.byKey("siteTitle")
  const description = await api.setting.byKey("siteDescription")

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden py-12 sm:py-20">
      {/* Background Pattern/Image - Low opacity and grayscale */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Background"
          fill
          className="object-cover opacity-5 grayscale"
          priority
        />
        <div className="to-background/80 absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-foreground mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-6xl">
              Selamat datang di
              <br className="hidden sm:block" />
              Website Profil Desa {title}
            </h1>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed sm:text-lg lg:text-xl">
              {description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/contact">HUBUNGI KAMI</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/profile">Selengkapnya</Link>
              </Button>
            </div>
          </div>
          {/* Official Image */}
          <div className="mt-10 flex justify-center lg:mt-0 lg:justify-end">
            <div className="relative h-80 w-64 sm:h-96 sm:w-80">
              <Image
                src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&dpr=1"
                fill
                alt={title!}
                className="bg-muted rounded-2xl object-cover shadow-2xl grayscale filter transition-all duration-500"
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 500px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
