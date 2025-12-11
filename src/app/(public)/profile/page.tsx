import Image from "next/image"
import { Icon, type IconProps } from "@yopem-ui/react-icons"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createApi } from "@/lib/trpc/server"

export default async function ProfilePage() {
  const api = await createApi()

  const desa = await api.setting.byKey("desa")
  const kodePos = await api.setting.byKey("kodePos")
  const kecamatan = await api.setting.byKey("kecamatan")
  const kabupaten = await api.setting.byKey("kabupaten")
  const provinsi = await api.setting.byKey("provinsi")
  const perbatasanUtara = await api.setting.byKey("perbatasanUtara")
  const perbatasanSelatan = await api.setting.byKey("perbatasanSelatan")
  const perbatasanTimur = await api.setting.byKey("perbatasanTimur")
  const perbatasanBarat = await api.setting.byKey("perbatasanBarat")
  const facebookUsername = await api.setting.byKey("facebookUsername")
  const instagramUsername = await api.setting.byKey("instagramUsername")
  const youtubeUsername = await api.setting.byKey("youtubeUsername")
  const whatsappNumber = await api.setting.byKey("whatsappNumber")
  const supportEmail = await api.setting.byKey("supportEmail")

  const visionPoints = [
    `Mewujudkan Desa ${desa} yang maju dan mandiri`,
    "Memanfaatkan potensi sumber daya alam berkelanjutan",
    "Mengembangkan sumber daya manusia berkualitas",
    "Menerapkan teknologi digital dalam pelayanan",
  ]

  const missionPoints = [
    "Meningkatkan kualitas pelayanan administrasi melalui digitalisasi",
    "Mengembangkan potensi ekonomi desa berbasis UMKM dan pariwisata",
    "Meningkatkan partisipasi masyarakat dalam pembangunan desa",
    "Melestarikan budaya dan lingkungan hidup yang berkelanjutan",
    "Membangun infrastruktur desa yang memadai dan modern",
  ]

  const boundaries = [
    { direction: "Utara", area: perbatasanUtara },
    { direction: "Selatan", area: perbatasanSelatan },
    { direction: "Timur", area: perbatasanTimur },
    { direction: "Barat", area: perbatasanBarat },
  ]

  const socialMedia: {
    platform: string
    icon: IconProps["name"]
    color: string
    handle: string
  }[] = [
    {
      platform: "Facebook",
      icon: "Facebook",
      color: "text-blue-600",
      handle: `@${facebookUsername}`,
    },
    {
      platform: "Instagram",
      icon: "Instagram",
      color: "text-pink-600",
      handle: `@${instagramUsername}`,
    },
    {
      platform: "YouTube",
      icon: "Youtube",
      color: "text-red-600",
      handle: `@${youtubeUsername}`,
    },
    {
      platform: "Email",
      icon: "Mail",
      color: "text-green-600",
      handle: supportEmail!,
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b py-24">
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="outline" className="mb-6">
              <Icon name="Building2" className="mr-2 size-4" />
              Profil Desa
            </Badge>
            <h1 className="text-foreground mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
              Desa {desa}
            </h1>
            <p className="text-muted-foreground mb-8 text-xl leading-relaxed lg:text-2xl">
              Kecamatan {kecamatan}, Kabupaten {kabupaten}, Provinsi {provinsi}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-muted text-muted-foreground flex items-center rounded-full px-4 py-2">
                <Icon name="MapPin" className="mr-2 size-4" />
                Kode Pos: {kodePos}
              </div>
              <div className="bg-muted text-muted-foreground flex items-center rounded-full px-4 py-2">
                <Icon name="Phone" className="mr-2 size-4" />
                {whatsappNumber}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Village Overview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Icon name="Globe" className="mr-2 size-4" />
                  Desa Digital
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
                  Desa {desa}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Desa {desa} merupakan desa yang telah menerapkan sistem
                  digitalisasi dalam pelayanan administrasi kepada masyarakat.
                  Dengan memanfaatkan teknologi modern, kami berkomitmen
                  memberikan pelayanan terbaik yang mudah, cepat, dan
                  transparan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Icon
                      name="Users"
                      className="text-foreground mx-auto mb-3 size-8"
                    />
                    <div className="text-foreground text-2xl font-bold">
                      1,578
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total Penduduk
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Icon
                      name="Building2"
                      className="text-foreground mx-auto mb-3 size-8"
                    />
                    <div className="text-foreground text-2xl font-bold">3</div>
                    <div className="text-muted-foreground text-sm">Dusun</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <div className="bg-muted aspect-square overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1"
                  width={600}
                  height={600}
                  alt="Village Landscape"
                  className="h-full w-full object-cover grayscale transition-transform duration-700"
                />
              </div>
              <div className="bg-card absolute -right-6 -bottom-6 rounded-2xl border p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-foreground text-2xl font-bold">
                    {kodePos}
                  </div>
                  <div className="text-muted-foreground text-sm">Kode Pos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Icon name="Target" className="mr-2 size-4" />
              Visi & Misi
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
              Visi & Misi Desa Sukatani
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              Komitmen kami dalam membangun desa yang maju, mandiri, dan
              sejahtera
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Vision */}
            <Card className="shadow-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-xl p-3">
                    <Icon name="Eye" className="size-6" />
                  </div>
                  <CardTitle className="text-foreground text-2xl">
                    Visi
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed font-medium">
                  "Mewujudkan Desa Sukatani yang maju, mandiri, dan sejahtera
                  dengan memanfaatkan potensi sumber daya alam dan sumber daya
                  manusia yang berkelanjutan serta berbasis teknologi digital."
                </p>
                <Separator />
                <div className="space-y-3">
                  {visionPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-foreground mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
                      <span className="text-muted-foreground text-sm">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="shadow-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-xl p-3">
                    <Icon name="Navigation" className="size-6" />
                  </div>
                  <CardTitle className="text-foreground text-2xl">
                    Misi
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {missionPoints.map((point, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 flex items-start space-x-3 rounded-lg p-3"
                    >
                      <div className="bg-foreground text-background flex size-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-foreground text-sm leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Boundaries */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <div className="bg-muted aspect-video overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                  width={800}
                  height={600}
                  alt="Village Map"
                  className="h-full w-full object-cover grayscale transition-transform duration-700"
                />
              </div>
              <div className="bg-card/90 absolute top-6 left-6 rounded-xl border p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" className="text-foreground size-5" />
                  <span className="text-foreground font-semibold">
                    Lokasi Desa
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Icon name="MapPin" className="mr-2 size-4" />
                  Lokasi & Batas Wilayah
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
                  Geografis Desa {desa}
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Desa {desa} terletak di posisi strategis di Kecamatan
                  {kecamatan}, Kabupaten {kabupaten}, Provinsi {provinsi}.
                  Lokasi yang strategis ini memberikan akses yang baik untuk
                  pengembangan ekonomi dan pariwisata.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {boundaries.map((boundary, index) => (
                  <Card
                    key={index}
                    className="shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-muted-foreground mb-2 text-sm font-medium">
                          Batas {boundary.direction}
                        </div>
                        <div className="text-foreground font-semibold">
                          {boundary.area}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4">
              <Icon name="Globe" className="mr-2 size-4" />
              Media Sosial
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
              Terhubung Dengan Kami
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              Ikuti media sosial resmi Desa Sukatani untuk mendapatkan informasi
              terbaru tentang kegiatan dan perkembangan desa
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {socialMedia.map((social, index) => (
              <Card
                key={index}
                className="group hover:border-foreground/20 cursor-pointer shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-muted text-foreground group-hover:bg-foreground group-hover:text-background mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl transition-colors">
                    <Icon name={social.icon} className="size-8" />
                  </div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    {social.platform}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {social.handle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="bg-primary text-primary-foreground shadow-xl">
            <CardContent className="p-8 text-center">
              <Icon
                name="Phone"
                className="mx-auto mb-4 h-12 w-12 opacity-90"
              />
              <h3 className="mb-2 text-2xl font-bold">Hubungi Kami</h3>
              <p className="text-primary-foreground/80 mb-4">
                Untuk informasi lebih lanjut dan pelayanan administrasi
              </p>
              <div className="text-3xl font-bold">{whatsappNumber}</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
