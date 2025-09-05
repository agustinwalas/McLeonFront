import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "@/store/useProduct";
import { useSupplierStore } from "@/store/useSupplier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IProductPopulated } from "@/types";

export default function SupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    supplier,
    loading: supplierLoading,
    error,
    fetchSupplierById,
  } = useSupplierStore();
  const { products, fetchProducts } = useProductStore();
  const [supplierProducts, setSupplierProducts] = useState<IProductPopulated[]>(
    []
  );

  useEffect(() => {
    if (id) {
      fetchSupplierById(id);
    }
  }, [id, fetchSupplierById]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (supplier && products.length > 0) {
      // Corregir la lógica: ahora associatedSuppliers son objetos con _id
      const associatedProducts = products.filter((product) =>
        product.associatedSuppliers.some(
          (supplierObj) => supplierObj._id === supplier._id
        )
      );
      setSupplierProducts(associatedProducts);
    }
  }, [supplier, products]);

  // ✅ Función para obtener el nombre de la categoría de forma segura
  const getCategoryName = (category: any): string => {
    if (!category) {
      return "Sin categoría";
    }

    // Si es string (ID sin poblar)
    if (typeof category === "string") {
      return "Sin categoría";
    }

    // Estructura anidada extraña
    if (category._id && typeof category._id === "object" && category._id.name) {
      return category._id.name;
    }

    // Estructura normal
    if (category.name && category.name !== "Categoría no encontrada") {
      return category.name;
    }

    return "Sin categoría";
  };

  if (supplierLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <Button asChild className="mt-4">
              <Link to="/admin/proveedores">Volver a proveedores</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 text-lg">Proveedor no encontrado</p>
            <Button asChild className="mt-4">
              <Link to="/admin/proveedores">Volver a proveedores</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{supplier.name}</h1>
          <p className="text-gray-500">Proveedor</p>
        </div>
        <Button asChild>
          <Link to="/admin/proveedores">Volver a proveedores</Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Proveedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Nombre</h3>
                <p className="text-gray-600">{supplier.name}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Teléfono</h3>
                <p className="text-gray-600">{supplier.phone}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">{supplier.email}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Ubicación</h3>
                <p className="text-gray-600">{supplier.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">
                  Total de Productos Suministrados
                </h3>
                <p className="text-gray-600">
                  {supplierProducts.length} productos
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Fecha de Registro</h3>
                <p className="text-gray-600">
                  {supplier.createdAt
                    ? new Date(supplier.createdAt).toLocaleDateString("es-AR")
                    : "N/A"}
                </p>
              </div>

              {supplier.updatedAt && (
                <div>
                  <h3 className="font-medium text-gray-900">
                    Última Actualización
                  </h3>
                  <p className="text-gray-600">
                    {new Date(supplier.updatedAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Associated Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Suministrados</CardTitle>
        </CardHeader>
        <CardContent>
          {supplierProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplierProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/productos/${product._id}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer block"
                >
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Código: {product.productCode}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {/* ✅ Categoría opcional con función segura */}
                    <p>
                      <span className="font-medium">Categoría:</span>
                      <span
                        className={
                          getCategoryName(product.category) === "Sin categoría"
                            ? "italic text-gray-400"
                            : ""
                        }
                      >
                        {" " + getCategoryName(product.category)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Stock:</span>{" "}
                      {product.currentStock} unidades
                    </p>
                    <p>
                      <span className="font-medium">Precio Minorista:</span> $
                      {product.retailPrice.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Este proveedor no tiene productos asociados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
