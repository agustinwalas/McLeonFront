// src/layouts/AdminLayout.tsx

import { AppSidebar } from "@/components/admin/layout/SideBar";
import { ResponsiveNavigation } from "@/components/admin/layout/ResponsiveNavigation";
import { GlobalSheet } from "@/components/ui/GlobalSheet";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ResponsiveNavigation />
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-grow container mx-auto p-4">
          <Outlet />
        </main>
      </SidebarProvider>
      <GlobalSheet />
    </div>
  );
}
