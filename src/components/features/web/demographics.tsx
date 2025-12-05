import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Demographics = () => {
  const stats = [
    { label: "Total Penduduk", value: "1578", color: "green", percentage: 100 },
    { label: "Penduduk Pria", value: "797", color: "blue", percentage: 50 },
    { label: "Penduduk Wanita", value: "781", color: "pink", percentage: 49 },
  ]

  const ageGroups = [
    { label: "Kelompok Warga Desa", value: 89 },
    { label: "Kelompok Tani", value: 75 },
    { label: "Kelompok Nelayan", value: 65 },
    { label: "Kelompok Perempuan", value: 58 },
    { label: "Kelompok Pemuda", value: 45 },
    { label: "Kelompok Wirausaha", value: 32 },
  ]

  return (
    <section className="bg-background py-16" id="statistik">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Infografis Desa
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Statistics Cards */}
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
                        stat.color === "green"
                          ? "bg-green-100"
                          : stat.color === "blue"
                            ? "bg-blue-100"
                            : "bg-pink-100"
                      }`}
                    >
                      <div
                        className={`absolute inset-2 rounded-full border-4 ${
                          stat.color === "green"
                            ? "border-green-500"
                            : stat.color === "blue"
                              ? "border-blue-500"
                              : "border-pink-500"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-bold ${
                          stat.color === "green"
                            ? "text-green-600"
                            : stat.color === "blue"
                              ? "text-blue-600"
                              : "text-pink-600"
                        }`}
                      >
                        {stat.percentage}%
                      </span>
                    </div>
                    <div>
                      <div className="text-foreground text-2xl font-bold">
                        {stat.value}
                      </div>
                      <div className="text-accent-foreground font-medium">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground text-center">
                  Kelompok Warga Desa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {ageGroups.map((group, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-accent-foreground">
                          {group.label}
                        </span>
                        <span className="font-semibold">{group.value}</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-gray-200">
                        <div
                          className="h-3 rounded-full bg-blue-500 transition-all duration-1000"
                          style={{ width: `${(group.value / 100) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button>Lihat Selengkapnya</Button>
        </div>
      </div>
    </section>
  )
}

export default Demographics
