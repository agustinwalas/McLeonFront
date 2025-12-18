import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProductPopulated, ISupplier } from "@/types";
import { UnitOfMeasure } from "@/types/product";
import { getUnitOfMeasureShort } from "@/utils/unitOfMeasure";

interface ProductDetailsCardProps {
  product: IProductPopulated;
  suppliers?: ISupplier[];
}

export function ProductDetailsCard({ product, suppliers = [] }: ProductDetailsCardProps) {
  // ✅ Función para obtener la unidad de medida con fallback
  const getUnit = () => {
    return product.unitOfMeasure || UnitOfMeasure.UNIDAD;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Código</h3>
            <p className="text-gray-600">{product.productCode}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Proveedores Asociados</h3>
            {suppliers.length > 0 ? (
              <div className="text-gray-600 space-y-1">
                {suppliers.map((supplier) => (
                  <p key={supplier._id}>{supplier.name}</p>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Sin proveedores asociados</p>
            )}
          </div>

          
          <div>
            <h3 className="font-medium text-gray-900">Precio Costo</h3>
            <p className="text-gray-600">${product.purchaseCost.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Precio Mayorista</h3>
            <p className="text-gray-600">${product.wholesalePrice.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Precio Minorista</h3>
            <p className="text-gray-600">${product.retailPrice.toFixed(2)}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Stock Actual</h3>
            <p className="text-gray-600">
              {product.currentStock} {getUnitOfMeasureShort(getUnit())}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Stock Mínimo</h3>
            <p className="text-gray-600">
              {product.minimumStock} {getUnitOfMeasureShort(getUnit())}
            </p>
          </div>

          {product.currentStock <= product.minimumStock && (
            <div>
              <h3 className="font-medium text-gray-900">Estado del Stock</h3>
              <p className="text-red-600 font-medium">⚠️ Stock bajo - Producto por debajo del mínimo</p>
            </div>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
}
