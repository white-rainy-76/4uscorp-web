'use client'

import { Settings, HelpCircle, Truck, FileText, UsersRound } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/shared/ui/sidebar'
import { Icon } from '@/shared/ui/Icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { useState } from 'react'
import Link from 'next/link'

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
  }
  return (
    <Sidebar>
      <SidebarHeader className="items-center p-6">
        <Link href="/">
          <Icon name="common/logo" width={32} height={32} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleItemClick('home')}
              isActive={activeItem === 'home'}
              tooltip="Dashboard"
              asChild>
              <Link href="/">
                <Truck className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleItemClick('docs')}
              isActive={activeItem === 'docs'}
              tooltip="Documents"
              asChild>
              <Link href="/docs">
                <FileText className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleItemClick('drivers')}
              isActive={activeItem === 'drivers'}
              tooltip="Drivers"
              asChild>
              <Link href="/drivers">
                <UsersRound className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mb-4" />
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-5 h-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle className="w-5 h-5" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
