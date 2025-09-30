import { useState } from "react";
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
  SettingsIcon,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import useAuth from "@/store/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  },
  {
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
    title: "AFIP",
    url: "/admin/afip",
    icon: FileText,
  },
  {
    title: "Configuración",
    url: "/admin/configuracion",
    icon: SettingsIcon,
  },
];

export function ResponsiveNavigation() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile Navigation (Navbar with hamburger menu)
  if (isMobile) {
    return (
      <>
        {/* Mobile Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logo_stampi_left_transparent.png"
                alt="Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Hamburger Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <img
                      src="/logo_stampi_left_transparent.png"
                      alt="Logo"
                      className="h-15 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {/* Menu Items */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                  >
                    <LogOutIcon size={18} />
                    <span>Cerrar Sesión</span>
                  </button>

                  {/* Footer */}
                  <div className="absolute bottom-4 left-4 right-4 text-xs text-gray-500 text-center">
                    <span>Stampi {year()} - All rights reserved.</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Mobile Content Spacer */}
        <div className="h-16"></div>
      </>
    );
  }

  // Desktop Sidebar (existing sidebar logic)
  return null; // The desktop sidebar will be handled by the existing AppSidebar
}
