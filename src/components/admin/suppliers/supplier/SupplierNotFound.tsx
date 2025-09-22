import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SupplierNotFoundProps {
  title?: string;
  message?: string;
}

export const SupplierNotFound = ({ 
  title = "Proveedor no encontrado",
  message = "El proveedor que buscás no existe o fue eliminado."
}: SupplierNotFoundProps) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 mb-4">{message}</p>
          <Button asChild>
            <Link to="/admin/proveedores">
              Volver a proveedores
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};