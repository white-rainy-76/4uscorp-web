import { SidebarProvider, SidebarTrigger } from '@/shared/ui/sidebar'
import { AppSidebar } from '@/widgets/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  )
}
