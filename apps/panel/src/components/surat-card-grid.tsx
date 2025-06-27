import Link from "next/link"
import { cn } from "@pintudesa/ui"

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => {
        const isDisabled = item.disabled

        const content = (
          <div
            className={cn(
              "border-border to-muted from-card flex items-start justify-between rounded-lg border bg-gradient-to-b p-4 shadow-sm transition-colors",
              !isDisabled && "hover:text-primary",
              isDisabled &&
                "bg-muted text-muted-foreground pointer-events-none",
            )}
          >
            <div className="flex flex-col gap-1 text-start">
              <span className="text-muted-foreground text-sm">{item.name}</span>
              <span className="text-3xl leading-none font-bold">
                {item.label}
              </span>
            </div>
            {item.icon && (
              <div className="text-muted-foreground">{item.icon}</div>
            )}
          </div>
        )

        return isDisabled ? (
          <div key={item.label} className="cursor-not-allowed">
            {content}
          </div>
        ) : (
          <Link key={item.label} href={item.href}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}
