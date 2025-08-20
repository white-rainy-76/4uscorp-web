'use client'

import {
  Settings,
  HelpCircle,
  Truck,
  UsersRound,
  Building2,
  Compass,
} from 'lucide-react'
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
import Link from 'next/link'
import { useAuthStore } from '@/shared/store/auth-store'
import { usePathname } from 'next/navigation'

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const canAccessCompanies = user ? user.role : false

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
              isActive={pathname === '/'}
              tooltip="Dashboard"
              asChild>
              <Link href="/">
                <Compass className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {canAccessCompanies && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname?.includes('/companies')}
                tooltip="Companies"
                asChild>
                <Link href="/companies">
                  <Building2 className="w-5 h-5" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname?.includes('/drivers')}
              tooltip="Drivers"
              asChild>
              <Link href="/drivers">
                <UsersRound className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname?.includes('/truck-models')}
              tooltip="Truck-models"
              asChild>
              <Link href="/truck-models">
                <Truck className="w-5 h-5" />
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
