import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISupplier, IProductPopulated } from "@/types";

interface SupplierStatsCardProps {
  supplier: ISupplier;
  supplierProducts: IProductPopulated[];
}

export const SupplierStatsCard = ({ 
  supplier, 
  supplierProducts 
}: SupplierStatsCardProps) => {
  return (
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
  );
};