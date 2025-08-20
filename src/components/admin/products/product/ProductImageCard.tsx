import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IProductPopulated } from "@/types";

interface ProductImageCardProps {
  product: IProductPopulated;
}

export function ProductImageCard({ product }: ProductImageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Producto</CardTitle>
      </CardHeader>
      <CardContent>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Categoría:</span>
            <Badge variant="secondary">{product.category.name}</Badge>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Fecha de Creación</h3>
            <p className="text-gray-600">
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString("es-AR")
                : "N/A"}
            </p>
          </div>

          {product.updatedAt && (
            <div>
              <h3 className="font-medium text-gray-900">
                Última Actualización
              </h3>
              <p className="text-gray-600">
                {new Date(product.updatedAt).toLocaleDateString("es-AR")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
