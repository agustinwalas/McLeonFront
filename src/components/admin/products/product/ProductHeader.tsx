import { Link } from "react-router-dom";
import { IProductPopulated } from "@/types";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  product: IProductPopulated;
}

export function ProductHeader({ product }: ProductHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">Código: {product.productCode}</p>
      </div>
      <Button asChild>
        <Link to="/admin/productos">
          Volver a productos
        </Link>
      </Button>
    </div>
  );
}
