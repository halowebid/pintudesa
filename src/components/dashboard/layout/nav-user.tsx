"use client"

import type { Session } from "@/lib/auth"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Menu,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuSeparator,
  MenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/lib/ui"
import { Icon } from "@yopem-ui/react-icons"

import SignOutButton from "@/components/dashboard/auth/sign-out-button"

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
