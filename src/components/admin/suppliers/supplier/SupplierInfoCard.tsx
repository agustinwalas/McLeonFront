import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISupplier } from "@/types";

interface SupplierInfoCardProps {
  supplier: ISupplier;
}

export const SupplierInfoCard = ({ supplier }: SupplierInfoCardProps) => {
  return (
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
  );
};