import { useSheetStore } from "@/store/useSheet";
import { ICategory } from "@/types";
import { useDialogStore } from "@/store/useDialog";
import { useCategoryStore } from "@/store/useCategory";
import { EditCategoryForm } from "../forms/EditCategoryForm";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const CategoryActions = ({ category }: { category: ICategory }) => {
  const { openSheet, closeSheet } = useSheetStore();
  const { deleteCategory } = useCategoryStore();
  const { openDialog, closeDialog } = useDialogStore();

  const handleEdit = () => {
    openSheet(
      "Editar categoría",
      "Completá los campos para editar tu categoría",
      <EditCategoryForm category={category} onSuccess={closeSheet} />
    );
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      deleteCategory(category._id);
      closeDialog();
    };

    openDialog({
      title: "Eliminar categoría",
      description: `¿Estás seguro de que quieres eliminar "${category.name}"?`,
      content: (
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
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