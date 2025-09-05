import { Link } from "react-router-dom";
import { IProductPopulated } from "@/types";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";
import { EditProductForm } from "../forms/EditProductForm";

interface ProductHeaderProps {
  product: IProductPopulated;
}

export function ProductHeader({ product }: ProductHeaderProps) {
  const { openSheet } = useSheetStore();
  return (
    <div className="flex gap-2 flex-wrap justify-between">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">Código: {product.productCode}</p>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          onClick={() =>
            openSheet(
              "Editar Producto",
              "Modifica los datos del producto",
              <EditProductForm product={product} onSuccess={() => {}} />
            )
          }
        >
          Editar Producto
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/productos">Volver a productos</Link>
        </Button>
      </div>
    </div>
  );
}
