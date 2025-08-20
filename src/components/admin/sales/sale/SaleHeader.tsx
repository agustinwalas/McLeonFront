import { Link } from "react-router-dom";
import { ISalePopulated } from "@/types/sale";
import { Button } from "@/components/ui/button";

interface SaleHeaderProps {
  sale: ISalePopulated;
}

export function SaleHeader({ sale }: SaleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{sale.saleNumber}</h1>
        </div>
        <p className="text-gray-500">
          Cliente: {sale.client.name} - {sale.client.cuit}
        </p>
        <p className="text-gray-500">
          Fecha: {new Date(sale.saleDate).toLocaleDateString("es-AR")}
        </p>
      </div>
      <Button asChild>
        <Link to="/admin/ventas">
          Volver a ventas
        </Link>
      </Button>
    </div>
  );
}
