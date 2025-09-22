import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SupplierErrorProps {
  error: string;
  onRetry?: () => void;
}

export const SupplierError = ({ error, onRetry }: SupplierErrorProps) => {
  return (
    <div className="container mx-auto p-6">
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar proveedor</h2>
          <p className="text-red-600 mb-4">{error}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Reintentar
              </Button>
            )}
            
            <Button asChild>
              <Link to="/admin/proveedores">
                Volver a proveedores
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};