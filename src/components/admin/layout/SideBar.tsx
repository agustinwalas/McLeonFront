import {
  LogOutIcon,
  ShoppingCart,
  Package,
  Truck,
  Users,
  FileText,
  FolderOpen,
  FileTerminal,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import useAuth from "@/store/useAuth";

function year() {
  const date = new Date();
  const year = date.getFullYear();
  return year;
}

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Ventas",
    url: "/admin/ventas",
    icon: ShoppingCart,
  },
  {
    title: "Productos",
    url: "/admin/productos",
    icon: Package,
  },
  {
    title: "Categorías",
    url: "/admin/categorias",
    icon: FolderOpen,
  },
  {
    title: "Proveedores",
    url: "/admin/proveedores",
    icon: Truck,
  },
  {
    title: "Clientes",
    url: "/admin/clientes",
    icon: Users,
  },
  {
    title: "Facturas Proveedores",
    url: "/admin/facturas-proveedores",
    icon: FileTerminal,
  },
  {
    title: "Facturas AFIP",
    url: "/admin/afip",
    icon: FileText,
  },
];

export function AppSidebar() {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Don't render sidebar on mobile
  if (isMobile) {
    return null;
  }

  return (
    <Sidebar 
      className="border-none shadow-none outline-none text-white"
      style={{ backgroundColor: '#05294f' }}
    >
      <SidebarContent>
        <SidebarGroup className="basis-full">
          <SidebarGroupContent className="mt-4 mb-9 flex gap-4 items-center w-50">
            <img
              src="/LogoMcleon.png"
              alt="Logo"
              style={{ height: '100px' }}
            />
          </SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="text-white hover:text-white">
                        <div className="flex items-center gap-3 text-sm">
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            <div
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-1 font-size-sm text-white"
            >
              <span className="font-bold">Cerrar Sesion</span>
              <LogOutIcon height={15} />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupLabel className="text-white">
            <span>Stampi {year()} - All rights reserved.</span>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
