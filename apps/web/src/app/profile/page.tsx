import Image from "next/image"
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@pintudesa/ui"
import { Icon, type IconProps } from "@yopem-ui/react-icons"

export default function ProfilePage() {
  const visionPoints = [
    "Mewujudkan Desa Sukatani yang maju dan mandiri",
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
    { direction: "Utara", area: "Desa Karya Mulya" },
    { direction: "Selatan", area: "Desa Muara Mulya" },
    { direction: "Timur", area: "Desa Sukakopi" },
    { direction: "Barat", area: "Desa Sukakopi Barat" },
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
      handle: "@desasukatani",
    },
    {
      platform: "Instagram",
      icon: "Instagram",
      color: "text-pink-600",
      handle: "@desa.sukatani",
    },
    {
      platform: "YouTube",
      icon: "Youtube",
      color: "text-red-600",
      handle: "Desa Sukatani Official",
    },
    {
      platform: "Email",
      icon: "Mail",
      color: "text-green-600",
      handle: "desasukatani@gmail.com",
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 dark:from-blue-800 dark:via-blue-900 dark:to-green-800"></div>
        {/* <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg\?auto=compress\&cs=tinysrgb\&w=1260\&h=750\&dpr=1')] bg-cover bg-center opacity-20"></div> */}
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="mx-auto max-w-4xl">
            <Badge className="mb-6 border-white/30 bg-white/20 text-white hover:bg-white/30">
              <Icon name="Building2" className="mr-2 size-4" />
              Profil Desa
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-bold text-transparent lg:text-7xl">
              Desa Sukatani
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-blue-100 lg:text-2xl">
              Kecamatan Sukakopi, Kabupaten Sukajanda, Provinsi Sumatera
              Tenggara
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Icon name="MapPin" className="mr-2 size-4" />
                Kode Pos: 28784
              </div>
              <div className="flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Icon name="Phone" className="mr-2 size-4" />
                +628127653486
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
                <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Icon name="Globe" className="mr-2 size-4" />
                  Desa Digital
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold">
                  Sukatani Digital Village
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Desa Sukatani merupakan desa yang telah menerapkan sistem
                  digitalisasi dalam pelayanan administrasi kepada masyarakat.
                  Dengan memanfaatkan teknologi modern, kami berkomitmen
                  memberikan pelayanan terbaik yang mudah, cepat, dan
                  transparan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-lg dark:from-green-900/20 dark:to-green-800/20">
                  <CardContent className="p-6 text-center">
                    <Icon
                      name="Users"
                      className="mx-auto mb-3 size-8 text-green-600"
                    />
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                      1,578
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-500">
                      Total Penduduk
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg dark:from-blue-900/20 dark:to-blue-800/20">
                  <CardContent className="p-6 text-center">
                    <Icon
                      name="Building2"
                      className="mx-auto mb-3 size-8 text-blue-600"
                    />
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      3
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-500">
                      Dusun
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1"
                  width={600}
                  height={600}
                  alt="Village Landscape"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="dark:bg-card absolute -right-6 -bottom-6 rounded-2xl border bg-white p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-foreground text-2xl font-bold">
                    28784
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
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Icon name="Target" className="mr-2 size-4" />
              Visi & Misi
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold">
              Visi & Misi Desa Sukatani
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              Komitmen kami dalam membangun desa yang maju, mandiri, dan
              sejahtera
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Vision */}
            <Card className="dark:via-background border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-xl dark:from-blue-900/10 dark:to-blue-900/10">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900">
                    <Icon
                      name="Eye"
                      className="size-6 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <CardTitle className="text-2xl text-blue-700 dark:text-blue-400">
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
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground text-sm">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="dark:via-background border-0 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-xl dark:from-green-900/10 dark:to-green-900/10">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900">
                    <Icon
                      name="Navigation"
                      className="size-6 text-green-600 dark:text-green-400"
                    />
                  </div>
                  <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                    Misi
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {missionPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 rounded-lg bg-green-50/50 p-3 dark:bg-green-900/10"
                    >
                      <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
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
              <div className="aspect-video overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                  width={800}
                  height={600}
                  alt="Village Map"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="dark:bg-card/90 absolute top-6 left-6 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" className="size-5 text-red-500" />
                  <span className="text-foreground font-semibold">
                    Lokasi Desa
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  <Icon name="MapPin" className="mr-2 size-4" />
                  Lokasi & Batas Wilayah
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold">
                  Geografis Desa Sukatani
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Desa Sukatani terletak di posisi strategis di Kecamatan
                  Sukakopi, Kabupaten Sukajanda, Provinsi Sumatera Tenggara.
                  Lokasi yang strategis ini memberikan akses yang baik untuk
                  pengembangan ekonomi dan pariwisata.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {boundaries.map((boundary, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg transition-shadow hover:shadow-xl"
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
            <Badge className="mb-4 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
              <Icon name="Globe" className="mr-2 size-4" />
              Media Sosial
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold">
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
                className="group cursor-pointer border-0 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-transform group-hover:scale-110 dark:bg-gray-800">
                    <Icon
                      name={social.icon}
                      className={`size-8 ${social.color}`}
                    />
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
          <Card className="border-0 bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <Icon
                name="Phone"
                className="mx-auto mb-4 h-12 w-12 opacity-90"
              />
              <h3 className="mb-2 text-2xl font-bold">Hubungi Kami</h3>
              <p className="mb-4 text-green-100">
                Untuk informasi lebih lanjut dan pelayanan administrasi
              </p>
              <div className="text-3xl font-bold">+628127653486</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
