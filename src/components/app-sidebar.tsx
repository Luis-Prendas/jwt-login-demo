import { Building, ChevronUp, LayoutDashboard, Settings, User2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { Link, useNavigate } from "react-router"
import { UserRole } from "@/types/enums"

const items = [
  {
    id: '1',
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    access: [UserRole.USER.toString(), UserRole.MODERATOR.toString(), UserRole.ADMIN.toString(), UserRole.SUPERADMIN.toString(), UserRole.DEVELOPER.toString()]
  },
  {
    id: '2',
    title: "Gestión de organizaciones",
    url: "/organization-management",
    icon: Building,
    access: [UserRole.DEVELOPER.toString()]
  },
  {
    id: '3',
    title: "Gestión de departamentos",
    url: "/department-management",
    icon: Settings,
    access: [UserRole.DEVELOPER.toString()]
  }
]

export function AppSidebar() {
  const { logout, userData } = useAuth()
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.access.includes(userData?.role || '')
                  ? (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                  : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {userData?.nickname}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="p-0 m-0">
                  <Link to={`/profile/${userData?.id}`} className="w-full p-2">Ver perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 m-0">
                  <button onClick={handleLogout} className="w-full p-2 text-left cursor-pointer">Cerrar sesión</button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}