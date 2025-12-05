import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle, cn } from "@/lib/ui"

interface SuratItem {
  label: string
  name: string
  href: string
  disabled?: boolean
  icon?: React.ReactNode
}

interface SuratCardGridProps {
  items: SuratItem[]
}

export function SuratCardGrid({ items }: SuratCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item) => {
        const isDisabled = item.disabled

        const CardContent = (
          <Card
            className={cn(
              "from-primary/5 to-card dark:bg-card @container/card bg-gradient-to-t shadow-xs",
              isDisabled && "pointer-events-none cursor-not-allowed opacity-60",
            )}
          >
            <CardHeader className="relative">
              <CardDescription>{item.name}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.label}
              </CardTitle>
              {item.icon && (
                <div className="text-muted-foreground absolute top-4 right-4">
                  {item.icon}
                </div>
              )}
            </CardHeader>
          </Card>
        )

        return isDisabled ? (
          <div key={item.label}>{CardContent}</div>
        ) : (
          <Link key={item.label} href={item.href} className="@container/card">
            {CardContent}
          </Link>
        )
      })}
    </div>
  )
}
