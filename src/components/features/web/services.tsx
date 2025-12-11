import { Icon, type IconProps } from "@yopem-ui/react-icons"

import { Card, CardContent } from "@/components/ui/card"

export const Services = () => {
  const services: {
    icon: IconProps["name"]
    title: string
    description: string
  }[] = [
    {
      icon: "Building",
      title: "Struktur Pemerintahan",
      description: "Informasi lengkap struktur organisasi pemerintahan desa",
    },
    {
      icon: "TrendingUp",
      title: "Visi & Misi",
      description: "Visi, misi, dan program kerja pemerintahan desa",
    },
    {
      icon: "FileCheck",
      title: "Cek Sertifikat",
      description: "Layanan pengecekan sertifikat dan dokumen resmi",
    },
    {
      icon: "BarChart3",
      title: "Program Pembangunan Desa",
      description: "Informasi program pembangunan dan progress pelaksanaan",
    },
    {
      icon: "FileText",
      title: "Laporan Dana Desa",
      description: "Transparansi penggunaan dan laporan dana desa",
    },
    {
      icon: "Users",
      title: "Lembaga Kemasyarakatan",
      description: "Informasi lembaga dan organisasi masyarakat desa",
    },
  ]

  return (
    <section className="bg-background py-16" id="profil">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Lebih Lanjut Tentang Desa
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
            Pintudesa berkomitmen untuk memberikan Aplikasi pelayanan terbaik
            untuk desa, kami memiliki fitur-fitur pelayanan administrasi yang
            dapat memudahkan perangkat desa dan penduduk untuk mengakses
            pelayanan Administrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group border-border/50 bg-background hover:border-foreground/20 transition-all duration-300 hover:shadow-sm"
            >
              <CardContent className="p-8 text-center">
                <div className="bg-muted text-foreground group-hover:bg-foreground group-hover:text-background mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300">
                  <Icon name={service.icon} className="size-6" />
                </div>
                <h3 className="text-foreground mb-3 text-lg font-semibold">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
