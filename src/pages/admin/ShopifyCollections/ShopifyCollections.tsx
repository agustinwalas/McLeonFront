// src/pages/admin/ShopifyCollections/ShopifyCollections.tsx

import { NewManualCollectionForm } from "@/components/admin/shopify-collections/forms/NewManualCollectionForm";
import { CollectionsTable } from "@/components/admin/shopify-collections/table/CollectionsTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";

export const ShopifyCollections = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Colecciones</h1>
        <div className="flex gap-2">
          <Button
            className="btn btn-primary"
            onClick={() =>
              openSheet(
                "Crear Collection Manual",
                "Completá los campos para crear una nueva collection personalizada",
                <NewManualCollectionForm onSuccess={closeSheet} />
              )
            }
          >
            Agregar
          </Button>
        </div>
      </div>

      <CollectionsTable />
    </>
  );
};
