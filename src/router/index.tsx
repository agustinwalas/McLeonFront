// src/router/index.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import AdminLayout from "../layouts/AdminLayout";
import RequireAuth from "../middleware/RequireAuth";

// Páginas de autenticación (no lazy para login rápido)
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Lazy loading para páginas del admin
const Dashboard = lazy(() => import("@/pages/admin/Dashboard/Dashboard").then(m => ({ default: m.Dashboard })));
const Products = lazy(() => import("@/pages/admin/Products/Products").then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import("@/components/admin/products/product/Product"));
const Categories = lazy(() => import("@/pages/admin/Categories/Categories").then(m => ({ default: m.Categories })));
const ShopifyCollections = lazy(() => import("@/pages/admin/ShopifyCollections/ShopifyCollections").then(m => ({ default: m.ShopifyCollections })));
const Afip = lazy(() => import("@/pages/admin/Afip/Afip").then(m => ({ default: m.Afip })));
const Clients = lazy(() => import("@/pages/admin/Clients/Clients").then(m => ({ default: m.Clients })));
const ClientDetail = lazy(() => import("@/components/admin/clients/client/ClientDetail"));
const Sales = lazy(() => import("@/pages/admin/Sales/Sales").then(m => ({ default: m.Sales })));
const NewSale = lazy(() => import("@/pages/admin/Sales/NewSale"));
const SaleDetail = lazy(() => import("@/components/admin/sales/sale/SaleDetail"));
const Suppliers = lazy(() => import("@/pages/admin/Suppliers/Suppliers").then(m => ({ default: m.Suppliers })));
const SupplierDetail = lazy(() => import("@/components/admin/suppliers/supplier/Supplier"));
const VoucherCreator = lazy(() => import("@/pages/admin/Afip/VoucherCreator").then(m => ({ default: m.VoucherCreator })));
const EditSale = lazy(() => import("@/pages/admin/Sales/EditSale"));
const ShopifySalesPage = lazy(() => import("@/pages/admin/ShopifySales/shopify-sales"));
const SuppliersInvoices = lazy(() => import("@/pages/admin/Suppliers invoices/SuppliersInvoices").then(m => ({ default: m.SuppliersInvoices })));

// Componente de loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);




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
      { 
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Sales />
          </Suspense>
        ) 
      },
      { 
        path: "dashboard", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ) 
      },
      { 
        path: "productos", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Products />
          </Suspense>
        ) 
      },
      { 
        path: "productos/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProductDetail />
          </Suspense>
        ) 
      },
      { 
        path: "productos/categorias", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Categories />
          </Suspense>
        ) 
      },
      { 
        path: "categorias", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Categories />
          </Suspense>
        ) 
      },
      { 
        path: "shopify-collections", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ShopifyCollections />
          </Suspense>
        ) 
      },
      { 
        path: "afip", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Afip />
          </Suspense>
        ) 
      },
      { 
        path: "clientes", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Clients />
          </Suspense>
        ) 
      },
      { 
        path: "clientes/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ClientDetail />
          </Suspense>
        ) 
      },
      { 
        path: "ventas", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Sales />
          </Suspense>
        ) 
      },
      { 
        path: "ventas/nueva", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NewSale />
          </Suspense>
        ) 
      },
      { 
        path: "ventas-shopify", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ShopifySalesPage />
          </Suspense>
        ) 
      },
      { 
        path: "ventas/editar/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <EditSale />
          </Suspense>
        ) 
      },
      { 
        path: "ventas/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SaleDetail />
          </Suspense>
        ) 
      },
      { 
        path: "ventas/nuevo-comprobante/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <VoucherCreator />
          </Suspense>
        ) 
      },
      { 
        path: "proveedores", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Suppliers />
          </Suspense>
        ) 
      },
      { 
        path: "proveedores/:id", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SupplierDetail />
          </Suspense>
        ) 
      },
      { 
        path: "facturas-proveedores", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SuppliersInvoices />
          </Suspense>
        ) 
      },
      { 
        path: "configuracion", 
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <div>Configuración - Próximamente</div>
          </Suspense>
        ) 
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
