'use client'

import {
  Settings,
  HelpCircle,
  Truck,
  UsersRound,
  Building2,
  Compass,
  LogOut,
  DollarSign,
  Map,
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
import { usePathname, useRouter } from 'next/navigation'
import { useDictionary } from '@/shared/lib/hooks'
import { LanguageSwitcher } from '@/shared/ui/language-switcher'

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { dictionary, lang } = useDictionary()

  const canAccessCompanies = user ? user.role : false

  const handleLogout = () => {
    logout()
    router.push(`/${lang}/auth/sign-in`)
  }

  return (
    <Sidebar>
      <SidebarHeader className="items-center p-6">
        <Link href={`/${lang}`}>
          <Icon name="common/logo" width={32} height={32} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={
                pathname === `/${lang}` || pathname === `/${lang}/dashboard`
              }
              tooltip={dictionary.home.navigation.dashboard}
              asChild>
              <Link href={`/${lang}`}>
                <Compass className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {canAccessCompanies && (
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname?.includes('/companies')}
                tooltip={dictionary.home.navigation.companies}
                asChild>
                <Link href={`/${lang}/companies`}>
                  <Building2 className="w-5 h-5" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname?.includes('/drivers')}
              tooltip={dictionary.home.navigation.drivers}
              asChild>
              <Link href={`/${lang}/drivers`}>
                <UsersRound className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname?.includes('/truck-models')}
              tooltip={dictionary.home.navigation.truck_models}
              asChild>
              <Link href={`/${lang}/truck-models`}>
                <Truck className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname?.includes('/tolls')}
              tooltip={dictionary.home.navigation.tolls}
              asChild>
              <Link href={`/${lang}/tolls`}>
                <DollarSign className="w-5 h-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname?.includes('/roads')}
              tooltip={dictionary.home.navigation.roads}
              asChild>
              <Link href={`/${lang}/roads`}>
                <Map className="w-5 h-5" />
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
          <SidebarMenuItem>
            <LanguageSwitcher />
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip={dictionary.home.auth.sign_out}>
              <LogOut className="w-5 h-5 text-red-500" />
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
