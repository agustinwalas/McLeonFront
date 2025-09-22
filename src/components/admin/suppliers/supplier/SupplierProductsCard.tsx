import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IProductPopulated, ISupplier } from "@/types";
import { useSheetStore } from "@/store/useSheet";
import { UpdateSupplierPrices } from "../forms/UpdateSupplierPrices";

interface SupplierProductsCardProps {
  supplierProducts: IProductPopulated[];
  supplier: ISupplier;
}

// ✅ Función para obtener el nombre de la categoría de forma segura
const getCategoryName = (category: any): string => {
  if (!category) return "Sin categoría";
  
  // Si es string (ID sin poblar)
  if (typeof category === "string") return "Sin categoría";
  
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

export const SupplierProductsCard = ({ supplierProducts, supplier }: SupplierProductsCardProps) => {
  const { openSheet, closeSheet } = useSheetStore();

  const handleUpdatePrices = () => {
    openSheet(
      "Actualizar precios",
      `Ajustá los precios de todos los productos de ${supplier.name}`,
      <UpdateSupplierPrices supplier={supplier} onSuccess={closeSheet} />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Productos Suministrados</CardTitle>
          {supplierProducts.length > 0 && (
            <Button onClick={handleUpdatePrices}>
              Actualizar precios
            </Button>
          )}
        </div>
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
                  <p>
                    <span className="font-medium">Categoría:</span>
                    <span className={
                      getCategoryName(product.category) === "Sin categoría"
                        ? "italic text-gray-400"
                        : ""
                    }>
                      {" " + getCategoryName(product.category)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Stock:</span>{" "}
                    {product.currentStock} {product.unitOfMeasure?.toLowerCase() || 'unidades'}
                  </p>
                  <p>
                    <span className="font-medium">Precio Minorista:</span> $
                    {product.retailPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
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
  );
};