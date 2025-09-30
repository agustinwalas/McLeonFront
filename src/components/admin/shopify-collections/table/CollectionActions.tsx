// src/components/admin/shopify-collections/table/CollectionActions.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/store/useDialog";
import { useSheetStore } from "@/store/useSheet";
import { useShopifyCollectionStore } from "@/store/useShopifyCollection";
import { IShopifyCollection } from "@/types";
import { Trash2, Pencil } from "lucide-react";
import { EditCollectionForm } from "../forms/EditCollectionForm";

interface CollectionActionsProps {
  collection: IShopifyCollection;
}

export const CollectionActions = ({ collection }: CollectionActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openDialog, closeDialog } = useDialogStore();
  const { openSheet, closeSheet } = useSheetStore();
  const { deleteCollectionCompletely } = useShopifyCollectionStore();

  const handleEdit = () => {
    openSheet(
      "Editar Colección",
      "Actualiza los datos de tu colección",
      <EditCollectionForm collection={collection} onSuccess={closeSheet} />
    );
  };

  const handleDelete = () => {
    openDialog({
      title: "Eliminar Colección",
      description: `¿Estás seguro que deseas eliminar la colección "${collection.collectionName}"? Esta acción la eliminará tanto del registro local como de Shopify.`,
      content: (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await deleteCollectionCompletely(collection._id);
                closeDialog();
              } catch (error) {
                console.error("Error deleting collection:", error);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Eliminar
          </Button>
        </div>
      ),
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="h-8 w-8 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
