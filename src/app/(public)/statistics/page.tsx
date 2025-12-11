import { Icon, type IconProps } from "@yopem-ui/react-icons"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressLinear } from "@/components/ui/progress-linear"
import { Separator } from "@/components/ui/separator"
import { createApi } from "@/lib/trpc/server"

export default async function StatisticsPage() {
  const api = await createApi()
  const summary = await api.statistics.getSummary()
  const demographics = await api.statistics.getDemographics()

  const basicStats: {
    number: string
    label: string
    sublabel: string
    icon: IconProps["name"]
  }[] = [
    {
      number: summary.totalDusun.toString(),
      label: "Jumlah Dusun",
      sublabel: "Desa Sukatani",
      icon: "MapPin",
    },
    {
      number: summary.totalRW.toString(),
      label: "Jumlah RW",
      sublabel: "Desa Sukatani",
      icon: "Users",
    },
    {
      number: summary.totalRT.toString(),
      label: "Jumlah RT",
      sublabel: "Desa Sukatani",
      icon: "Target",
    },
  ]

  const totalPopulation = summary.totalPenduduk

  const populationStats: {
    number: string
    label: string
    percentage: number
    icon: IconProps["name"]
  }[] = demographics.gender.map((item) => ({
    number: item.value.toLocaleString(),
    label: item.label === "laki-laki" ? "Laki-laki" : "Perempuan",
    percentage:
      totalPopulation > 0
        ? parseFloat(((item.value / totalPopulation) * 100).toFixed(1))
        : 0,
    icon: "Users",
  }))

  // Add total population entry
  populationStats.push({
    number: totalPopulation.toLocaleString(),
    label: "Total Penduduk",
    percentage: 100,
    icon: "Users",
  })

  const occupationData = demographics.occupation.map((item) => ({
    label: item.label,
    value: item.value,
    percentage:
      totalPopulation > 0
        ? Math.round((item.value / totalPopulation) * 100)
        : 0,
  }))

  const educationData = demographics.education.map((item) => ({
    level: item.label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    count: item.value,
    percentage:
      totalPopulation > 0
        ? Math.round((item.value / totalPopulation) * 100)
        : 0,
  }))

  const ageGroups: {
    label: string
    value: number
    percentage: number
    icon: IconProps["name"]
  }[] = demographics.ageGroups.map((item) => ({
    label: item.label,
    value: item.value,
    percentage:
      totalPopulation > 0
        ? Math.round((item.value / totalPopulation) * 100)
        : 0,
    icon: item.label.includes("Balita") ? "Baby" : "Users",
  }))

  // Find most common age group
  const mostCommonAgeGroup = [...ageGroups]
    .sort((a, b) => b.value - a.value)
    .at(0)

  const topOccupation = occupationData.at(0)
  const topEducation = educationData.at(0)

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b py-24">
        <div className="relative container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="outline" className="mb-6">
              <Icon name="BarChart3" className="mr-2 size-4" />
              Data Statistik
            </Badge>
            <h1 className="text-foreground mb-6 text-5xl font-bold tracking-tight lg:text-7xl">
              Statistik Desa
            </h1>
            <p className="text-muted-foreground mb-8 text-xl leading-relaxed lg:text-2xl">
              Data Lengkap Demografi dan Statistik Desa Sukatani
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-muted text-muted-foreground flex items-center rounded-full px-4 py-2">
                <Icon name="Activity" className="mr-2 size-4" />
                Data Terkini {new Date().getFullYear()}
              </div>
              <div className="bg-muted text-muted-foreground flex items-center rounded-full px-4 py-2">
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
            <Badge variant="outline" className="mb-4">
              <Icon name="MapPin" className="mr-2 size-4" />
              Statistik Dasar
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
              Pembagian Wilayah Administratif
            </h2>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {basicStats.map((stat, index) => (
              <Card
                key={index}
                className="group hover:border-foreground/20 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                    <Icon
                      name={stat.icon}
                      className="text-foreground size-10"
                    />
                  </div>
                  <div className="text-foreground mb-3 text-5xl font-bold">
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
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-lg p-2">
                    <Icon name="MapPin" className="size-6" />
                  </div>
                  <span>Infografis Desa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary text-primary-foreground rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-primary-foreground/80 text-sm">
                        Nama Desa
                      </div>
                      <div className="font-bold">Sukatani</div>
                    </div>
                    <div>
                      <div className="text-primary-foreground/80 text-sm">
                        Kecamatan
                      </div>
                      <div className="font-bold">Sukakopi</div>
                    </div>
                    <div>
                      <div className="text-primary-foreground/80 text-sm">
                        Kabupaten
                      </div>
                      <div className="font-bold">Sukajanda</div>
                    </div>
                    <div>
                      <div className="text-primary-foreground/80 text-sm">
                        Provinsi
                      </div>
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
                  className="shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-muted rounded-lg p-3">
                          <Icon
                            name={stat.icon}
                            className="text-foreground size-6"
                          />
                        </div>
                        <div>
                          <div className="text-foreground text-2xl font-bold">
                            {stat.number}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground text-lg font-bold">
                          {stat.percentage}%
                        </div>
                        <div className="text-muted-foreground text-xs">
                          dari total
                        </div>
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
                <Badge variant="outline" className="mb-4">
                  <Icon name="Briefcase" className="mr-2 size-4" />
                  Mata Pencaharian
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
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
                    className="shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-foreground size-4 rounded-full"></div>
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
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <Icon
                      name="Briefcase"
                      className="text-foreground size-10"
                    />
                  </div>
                  <div className="text-foreground mb-3 text-5xl font-bold">
                    {topOccupation?.value ?? 0}
                  </div>
                  <div className="text-foreground mb-2 text-xl font-semibold">
                    {topOccupation?.label ?? "Belum ada data"}
                  </div>
                  <div className="text-muted-foreground">
                    Pekerjaan mayoritas warga desa
                  </div>
                  <Separator className="my-6" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-foreground font-semibold">
                        {topOccupation?.percentage ?? 0}%
                      </div>
                      <div className="text-muted-foreground">
                        dari total penduduk
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground font-semibold">
                        Sektor
                      </div>
                      <div className="text-muted-foreground">
                        {topOccupation?.label ?? "-"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon name="PieChart" className="text-foreground size-6" />
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
                          <div className="bg-foreground size-3 rounded-full"></div>
                          <span className="text-foreground text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-bold">
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
                <Badge variant="outline" className="mb-4">
                  <Icon name="GraduationCap" className="mr-2 size-4" />
                  Tingkat Pendidikan
                </Badge>
                <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
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
                  <Card key={index} className="shadow-sm">
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

            <Card className="shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <Icon
                    name="GraduationCap"
                    className="text-foreground size-10"
                  />
                </div>
                <div className="text-foreground mb-3 text-5xl font-bold">
                  {topEducation?.count ?? 0}
                </div>
                <div className="text-foreground mb-2 text-xl font-semibold">
                  {topEducation?.level ?? "Belum ada data"}
                </div>
                <div className="text-muted-foreground mb-6">
                  Tingkat pendidikan mayoritas
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-foreground font-semibold">
                      {topEducation?.percentage ?? 0}%
                    </div>
                    <div className="text-muted-foreground">
                      dari total penduduk
                    </div>
                  </div>
                  <div>
                    <div className="text-foreground font-semibold">
                      Kategori
                    </div>
                    <div className="text-muted-foreground">
                      {topEducation?.level ?? "-"}
                    </div>
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
            <Badge variant="outline" className="mb-4">
              <Icon name="Users" className="mr-2 size-4" />
              Kelompok Usia
            </Badge>
            <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
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
                  className="shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-muted rounded-lg p-2">
                          <Icon
                            name={group.icon}
                            className="text-foreground size-5"
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
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                    <Icon name="Users" className="text-foreground size-10" />
                  </div>
                  <div className="text-foreground mb-3 text-5xl font-bold">
                    {mostCommonAgeGroup?.value ?? 0}
                  </div>
                  <div className="text-foreground mb-2 text-lg font-semibold">
                    {mostCommonAgeGroup?.label.split("(")[0].trim() ??
                      "Belum ada data"}
                  </div>
                  <div className="text-muted-foreground mb-4 text-sm">
                    {mostCommonAgeGroup
                      ? (/\((.*?)\)/.exec(mostCommonAgeGroup.label)?.[0] ?? "")
                      : ""}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Kelompok usia terbanyak
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Ringkasan Demografis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ageGroups.slice(0, 3).map((group, i) => (
                    <div
                      key={i}
                      className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                    >
                      <span className="text-sm font-medium">
                        {group.label.split("(")[0].trim()}
                      </span>
                      <span className="text-foreground font-bold">
                        {group.percentage}%
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
