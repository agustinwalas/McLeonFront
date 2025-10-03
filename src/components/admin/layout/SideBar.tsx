import {
  LogOutIcon,
  ShoppingCart,
  ShoppingBasket,
  Package,
  Truck,
  Users,
  FileText,
  FolderOpen,
  ChartBarStacked,
  FileTerminal,
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
    title: "Ventas",
    url: "/admin/ventas",
    icon: ShoppingCart,
  },  {
    title: "Ventas Shopify",
    url: "/admin/ventas-shopify",
    icon: ShoppingBasket,
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
    title: "Colecciones",
    url: "/admin/shopify-collections",
    icon: ChartBarStacked,
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
      className="border-none shadow-none outline-none"
      style={{ backgroundColor: '#f7f2eb' }}
    >
      <SidebarContent>
        <SidebarGroup className="basis-full">
          <SidebarGroupContent className="mt-4 mb-9 flex gap-4 items-center w-50">
            <img
              src="/logo_stampi_left_transparent.png"
              alt="Logo"
            />
          </SidebarGroupContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
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
          <SidebarGroupLabel>
            <div
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-1 font-size-sm"
            >
              <span className="font-bold">Cerrar Sesion</span>
              <LogOutIcon height={15} />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupLabel>
            <span>Stampi {year()} - All rights reserved.</span>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
