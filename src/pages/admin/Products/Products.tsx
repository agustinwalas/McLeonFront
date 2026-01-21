import { NewProductForm } from "@/components/admin/products/forms/NewProductForm";
import { ProductsTable } from "@/components/admin/products/table/ProductsTable";
import { ImportPricesModal } from "@/components/admin/products/ImportPricesModal";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";
import { useState } from "react";
import { Upload } from "lucide-react";

export const Products = () => {
  const { openSheet, closeSheet } = useSheetStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Productos</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
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
      <ImportPricesModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
    </>
  );
};
