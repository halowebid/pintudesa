"use client"

import { Icon } from "@yopem-ui/react-icons"

import SignOutButton from "@/components/features/auth/sign-out-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Session } from "@/lib/auth"

interface NavUserProps extends React.ComponentProps<typeof SidebarMenu> {
  user: Session["user"]
}

const NavUser = (props: NavUserProps) => {
  const { user } = props

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu>
          <MenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user.image && (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image} alt="Avatar" />
                  <AvatarFallback className="rounded-lg">UT</AvatarFallback>
                </Avatar>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <Icon name="ChevronsUpDown" className="ml-auto size-4" />
            </SidebarMenuButton>
          </MenuTrigger>
          <MenuContent className="min-w-56 rounded-lg">
            <MenuItemGroup>
              <MenuItemGroupLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {user.image && (
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.image} alt="Avatar" />
                      <AvatarFallback className="rounded-lg">UT</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </MenuItemGroupLabel>
            </MenuItemGroup>
            <MenuSeparator />
            <MenuItem value="Sign Out">
              <SignOutButton />
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavUser
