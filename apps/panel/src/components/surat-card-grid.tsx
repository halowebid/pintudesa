import Link from "next/link"
import { cn } from "@pintudesa/ui"

interface SuratItem {
  label: string
  name: string
  href: string
  disabled?: boolean
}

interface SuratCardGridProps {
  items: SuratItem[]
}

export function SuratCardGrid({ items }: SuratCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => {
        const isDisabled = item.disabled

        const baseStyle =
          "rounded-lg border p-4 text-center transition-colors font-medium shadow-sm"
        const textStyle = "text-color-foreground"
        const hoverStyle = "hover:bg-primary hover:text-primary-foreground"
        const disabledStyle =
          "bg-muted text-muted-foreground border-border pointer-events-none shadow-none cursor-default"

        const cardClass = cn(
          baseStyle,
          textStyle,
          !isDisabled && hoverStyle,
          isDisabled && disabledStyle,
        )

        const content = (
          <div className={cardClass}>
            <div className="text-4xl font-extrabold drop-shadow-sm">
              {item.label}
            </div>
            <div className="mt-1 text-sm">{item.name}</div>
          </div>
        )

        return isDisabled ? (
          <div key={item.label}>{content}</div>
        ) : (
          <Link key={item.label} href={item.href}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}
