// src/router/index.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import RequireAuth from "../middleware/RequireAuth";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { Products } from "@/pages/admin/Products/Products";
import ProductDetail from "@/components/admin/products/product/Product";
import { Categories } from "@/pages/admin/Categories/Categories";
import { Afip } from "@/pages/admin/Afip/Afip";
import { Clients } from "@/pages/admin/Clients/Clients";
import ClientDetail from "@/components/admin/clients/client/ClientDetail";
import { Sales } from "@/pages/admin/Sales/Sales";
import NewSale from "@/pages/admin/Sales/NewSale";
import SaleDetail from "@/components/admin/sales/sale/SaleDetail";
import { Suppliers } from "@/pages/admin/Suppliers/Suppliers";
import SupplierDetail from "@/components/admin/suppliers/supplier/Supplier";
import { VoucherCreator } from "@/pages/admin/Afip/VoucherCreator";
import EditSale from "@/pages/admin/Sales/EditSale";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: (
      <RequireAuth adminOnly>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { path: "productos", element: <Products /> },
      { path: "productos/:id", element: <ProductDetail /> },
      { path: "productos/categorias", element: <Categories /> },
      { path: "afip", element: <Afip /> },
      { path: "clientes", element: <Clients /> },
      { path: "clientes/:id", element: <ClientDetail /> },
      { path: "ventas", element: <Sales /> },
      { path: "ventas/nueva", element: <NewSale /> },
      { path: "ventas/editar/:id", element: <EditSale /> },
      { path: "ventas/:id", element: <SaleDetail /> },
      { path: "ventas/nuevo-comprobante/:id", element: <VoucherCreator /> },
      { path: "proveedores", element: <Suppliers /> },
      { path: "proveedores/:id", element: <SupplierDetail /> },
      { path: "configuracion", element: <div>Configuración - Próximamente</div> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
