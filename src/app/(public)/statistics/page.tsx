import { Icon, type IconProps } from "@yopem-ui/react-icons"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressLinear } from "@/components/ui/progress-linear"
import { Separator } from "@/components/ui/separator"

export default function StatisticsPage() {
  const basicStats: {
    number: string
    label: string
    sublabel: string
    icon: IconProps["name"]
    color: string
    bgColor: string
  }[] = [
    {
      number: "3",
      label: "Jumlah Dusun",
      sublabel: "Desa Sukatani",
      icon: "MapPin",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      number: "6",
      label: "Jumlah RW",
      sublabel: "Desa Sukatani",
      icon: "Users",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      number: "12",
      label: "Jumlah RT",
      sublabel: "Desa Sukatani",
      icon: "Target",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
  ]

  const populationStats: {
    number: string
    label: string
    percentage: number
    color: string
    icon: IconProps["name"]
  }[] = [
    {
      number: "797",
      label: "Laki-laki",
      percentage: 50.5,
      color: "from-blue-500 to-blue-600",
      icon: "Users",
    },
    {
      number: "781",
      label: "Perempuan",
      percentage: 49.5,
      color: "from-pink-500 to-pink-600",
      icon: "Users",
    },
    {
      number: "1,578",
      label: "Total Penduduk",
      percentage: 100,
      color: "from-green-500 to-green-600",
      icon: "Users",
    },
  ]

  const occupationData = [
    {
      label: "Buruh Tani/Perkebunan",
      value: 814,
      percentage: 52,
      color: "bg-green-500",
    },
    { label: "Petani", value: 245, percentage: 15, color: "bg-blue-500" },
    { label: "Wiraswasta", value: 189, percentage: 12, color: "bg-purple-500" },
    { label: "Pedagang", value: 156, percentage: 10, color: "bg-orange-500" },
    { label: "PNS", value: 98, percentage: 6, color: "bg-red-500" },
    { label: "Nelayan", value: 76, percentage: 5, color: "bg-cyan-500" },
  ]

  const educationData = [
    { level: "SLTA/Sederajat", count: 1138, percentage: 72 },
    { level: "Diploma/S1", count: 234, percentage: 15 },
    { level: "SMP/Sederajat", count: 156, percentage: 10 },
    { level: "SD/Sederajat", count: 50, percentage: 3 },
  ]

  const ageGroups: {
    label: string
    value: number
    percentage: number
    icon: IconProps["name"]
  }[] = [
    { label: "Balita (0-5 Tahun)", value: 89, percentage: 15, icon: "Baby" },
    {
      label: "Anak-anak (6-12 Tahun)",
      value: 156,
      percentage: 25,
      icon: "Users",
    },
    {
      label: "Remaja (13-17 Tahun)",
      value: 134,
      percentage: 22,
      icon: "Users",
    },
    {
      label: "Dewasa Muda (18-25 Tahun)",
      value: 178,
      percentage: 30,
      icon: "Users",
    },
    {
      label: "Dewasa (26-35 Tahun)",
      value: 245,
      percentage: 40,
      icon: "Users",
    },
    {
      label: "Dewasa Akhir (36-45 Tahun)",
      value: 344,
      percentage: 55,
      icon: "Users",
    },
    {
      label: "Lansia Awal (46-55 Tahun)",
      value: 289,
      percentage: 47,
      icon: "Users",
    },
    {
      label: "Lansia Akhir (56+ Tahun)",
      value: 143,
      percentage: 23,
      icon: "Users",
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 dark:from-red-800 dark:via-orange-800 dark:to-yellow-800"></div>
        {/*<div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-20"></div>*/}
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="mx-auto max-w-4xl">
            <Badge className="mb-6 border-white/30 bg-white/20 text-white hover:bg-white/30">
              <Icon name="BarChart3" className="mr-2 size-4" />
              Data Statistik
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-5xl font-bold text-transparent lg:text-7xl">
              Statistik Desa
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-orange-100 lg:text-2xl">
              Data Lengkap Demografi dan Statistik Desa Sukatani
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Icon name="Activity" className="mr-2 size-4" />
                Data Terkini 2025
              </div>
              <div className="flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Icon name="TrendingUp" className="mr-2 size-4" />
                Analisis Real-time
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Statistics */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Icon name="MapPin" className="mr-2 size-4" />
              Statistik Dasar
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold">
              Pembagian Wilayah Administratif
            </h2>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {basicStats.map((stat, index) => (
              <Card
                key={index}
                className="group border-0 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`${stat.bgColor} mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:scale-110`}
                  >
                    <Icon name={stat.icon} className="size-10 text-current" />
                  </div>
                  <div
                    className={`bg-gradient-to-r text-5xl font-bold ${stat.color} mb-3 bg-clip-text text-transparent`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-foreground mb-2 text-xl font-semibold">
                    {stat.label}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.sublabel}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Population Overview */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Village Info Card */}
            <Card className="dark:via-background border-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-xl dark:from-slate-900/50 dark:to-slate-900/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <Icon
                      name="MapPin"
                      className="size-6 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span>Infografis Desa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm opacity-90">Nama Desa</div>
                      <div className="font-bold">Sukatani</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Kecamatan</div>
                      <div className="font-bold">Sukakopi</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Kabupaten</div>
                      <div className="font-bold">Sukajanda</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Provinsi</div>
                      <div className="font-bold">Sumatera Tenggara</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Population Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              {populationStats.map((stat, index) => (
                <Card
                  key={index}
                  className={`border-0 bg-gradient-to-r shadow-lg ${stat.color} text-white transition-shadow hover:shadow-xl`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-lg bg-white/20 p-3">
                          <Icon name={stat.icon} className="size-6" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {stat.number}
                          </div>
                          <div className="text-sm opacity-90">{stat.label}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {stat.percentage}%
                        </div>
                        <div className="text-xs opacity-75">dari total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Occupation Statistics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <Icon name="Briefcase" className="mr-2 size-4" />
                  Mata Pencaharian
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold">
                  Pekerjaan Warga
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Distribusi pekerjaan mayoritas warga Desa Sukatani berdasarkan
                  data terbaru menunjukkan dominasi sektor pertanian dan
                  perkebunan.
                </p>
              </div>

              <div className="space-y-4">
                {occupationData.map((item, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`size-4 rounded-full ${item.color}`}
                          ></div>
                          <span className="text-foreground font-medium">
                            {item.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-foreground font-bold">
                            {item.value}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                      <ProgressLinear value={item.percentage} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <Card className="dark:via-background border-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 shadow-xl dark:from-orange-900/10 dark:to-orange-900/10">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                    <Icon
                      name="Briefcase"
                      className="size-10 text-orange-600 dark:text-orange-400"
                    />
                  </div>
                  <div className="mb-3 text-5xl font-bold text-orange-600 dark:text-orange-400">
                    814
                  </div>
                  <div className="text-foreground mb-2 text-xl font-semibold">
                    Buruh Tani/Perkebunan
                  </div>
                  <div className="text-muted-foreground">
                    Pekerjaan mayoritas warga desa
                  </div>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-foreground font-semibold">52%</div>
                      <div className="text-muted-foreground">
                        dari total penduduk
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground font-semibold">
                        Sektor
                      </div>
                      <div className="text-muted-foreground">Pertanian</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon name="PieChart" className="size-6 text-blue-600" />
                    <span>Distribusi Pekerjaan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {occupationData.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`size-3 rounded-full ${item.color}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold">
                          {item.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Education Statistics */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Icon name="GraduationCap" className="mr-2 size-4" />
                  Tingkat Pendidikan
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold">
                  Pendidikan Warga
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Tingkat pendidikan masyarakat Desa Sukatani menunjukkan tren
                  positif dengan mayoritas warga memiliki pendidikan menengah
                  atas.
                </p>
              </div>

              <div className="space-y-4">
                {educationData.map((item, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-foreground font-medium">
                          {item.level}
                        </span>
                        <div className="text-right">
                          <div className="text-foreground font-bold">
                            {item.count}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                      <ProgressLinear value={item.percentage} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="dark:via-background border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-xl dark:from-blue-900/10 dark:to-blue-900/10">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Icon
                    name="GraduationCap"
                    className="size-10 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div className="mb-3 text-5xl font-bold text-blue-600 dark:text-blue-400">
                  1,138
                </div>
                <div className="text-foreground mb-2 text-xl font-semibold">
                  SLTA / Sederajat
                </div>
                <div className="text-muted-foreground mb-6">
                  Tingkat pendidikan mayoritas
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-foreground font-semibold">72%</div>
                    <div className="text-muted-foreground">
                      dari total penduduk
                    </div>
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">
                      Kategori
                    </div>
                    <div className="text-muted-foreground">Menengah Atas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Age Group Statistics */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Icon name="Users" className="mr-2 size-4" />
              Kelompok Usia
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold">
              Distribusi Usia Warga
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
              Komposisi usia penduduk Desa Sukatani menunjukkan struktur
              demografis yang seimbang dengan dominasi usia produktif
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {ageGroups.map((group, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg transition-shadow hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                          <Icon
                            name={group.icon}
                            className="size-5 text-purple-600 dark:text-purple-400"
                          />
                        </div>
                        <span className="text-foreground font-medium">
                          {group.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground font-bold">
                          {group.value}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {group.percentage}%
                        </div>
                      </div>
                    </div>
                    <ProgressLinear value={group.percentage} className="h-3" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="dark:via-background border-0 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-xl dark:from-green-900/10 dark:to-green-900/10">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Icon
                      name="Users"
                      className="size-10 text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div className="mb-3 text-5xl font-bold text-green-600 dark:text-green-400">
                    344
                  </div>
                  <div className="text-foreground mb-2 text-lg font-semibold">
                    Dewasa Akhir
                  </div>
                  <div className="text-muted-foreground mb-4 text-sm">
                    (36-45 Tahun)
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Kelompok usia terbanyak
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Ringkasan Demografis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                    <span className="text-sm font-medium">Usia Produktif</span>
                    <span className="font-bold text-green-600">67%</span>
                  </div>
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                    <span className="text-sm font-medium">Anak & Remaja</span>
                    <span className="font-bold text-blue-600">25%</span>
                  </div>
                  <div className="bg-muted/50 flex items-center justify-between rounded-lg p-3">
                    <span className="text-sm font-medium">Lansia</span>
                    <span className="font-bold text-orange-600">8%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
