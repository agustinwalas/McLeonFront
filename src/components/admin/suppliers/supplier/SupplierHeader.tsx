import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ISupplier } from "@/types";

interface SupplierHeaderProps {
  supplier: ISupplier;
}

export const SupplierHeader = ({ supplier }: SupplierHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
        <p className="text-gray-500 mt-1">Proveedor</p>
      </div>
      
      <Button asChild>
        <Link to="/admin/proveedores">
          Volver a proveedores
        </Link>
      </Button>
    </div>
  );
};