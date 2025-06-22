import * as React from "react"
import type { UserRole } from "@pintudesa/db"
import { Badge } from "@pintudesa/ui"
import { cn } from "@yopem-ui/utils"

interface UserRoleBadgeProps extends React.ComponentProps<typeof Badge> {
  role: UserRole
  children: React.ReactNode
}

const UserRoleBadge = (props: UserRoleBadgeProps) => {
  const { role, className, children } = props

  const roleToVariantMap: Record<UserRole, UserRoleBadgeProps["variant"]> = {
    admin: "default",
    user: "outline",
    member: "outline",
  }

  const variant = roleToVariantMap[role] ?? "default"

  return (
    <Badge className={cn("uppercase", className)} variant={variant}>
      {children}
    </Badge>
  )
}

export default UserRoleBadge
