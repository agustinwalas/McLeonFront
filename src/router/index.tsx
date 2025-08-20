// src/router/index.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import RequireAuth from "../middleware/RequireAuth";

import { Categories } from "@/pages/admin/Categories";
import { Products } from "@/pages/admin/Products";
import { Afip } from "@/pages/admin/Afip";
import { Clients } from "@/pages/admin/Clients";
import { Sales } from "@/pages/admin/Sales";
import NewSale from "@/pages/admin/NewSale";
import SaleDetail from "@/components/admin/sales/sale/SaleDetail";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { Suppliers } from "@/pages/admin/Suppliers";
import ClientDetail from "@/components/admin/clients/client/ClientDetail";
import ProductDetail from "@/components/admin/products/product/Product";
import SupplierDetail from "@/components/admin/suppliers/supplier/Supplier";

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
      { path: "ventas/:id", element: <SaleDetail /> },
      { path: "proveedores", element: <Suppliers /> },
      { path: "proveedores/:id", element: <SupplierDetail /> },
      { path: "configuracion", element: <div>Configuración - Próximamente</div> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
