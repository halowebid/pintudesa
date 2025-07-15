"use client"

import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@pintudesa/ui"

interface NavMainProps extends React.ComponentProps<typeof SidebarGroup> {
  items: {
    name: string
    url: string
    disabled?: boolean
  }[]
  label: string
}

const NavMain = (props: NavMainProps) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{props.label}</SidebarGroupLabel>
      <SidebarMenu>
        {props.items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              {item.disabled ? (
                <span className="!text-muted-foreground/70 line-clamp-2 !max-h-16 !min-h-8 !cursor-not-allowed">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="!max-h-16 !min-h-8">
                  <span className="line-clamp-2">{item.name}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain
