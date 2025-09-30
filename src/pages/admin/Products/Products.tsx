import { NewProductForm } from "@/components/admin/products/forms/NewProductForm";
import { ProductsTable } from "@/components/admin/products/table/ProductsTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";

export const Products = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Productos</h1>
        <div className="flex gap-2">
          <Button
            className="btn btn-primary"
            onClick={() =>
              openSheet(
                "Agregar Producto",
                "Completá los campos para crear un nuevo Producto",
                <NewProductForm onSuccess={closeSheet} />
              )
            }
          >
            Agregar
          </Button>
        </div>
      </div>
      <ProductsTable />
    </>
  );
};
