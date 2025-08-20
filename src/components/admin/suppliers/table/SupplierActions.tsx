import { useState } from "react";
import { Link } from "react-router-dom";
import { useSheetStore } from "@/store/useSheet";
import { ISupplier } from "@/types";
import { useDialogStore } from "@/store/useDialog";
import { useSupplierStore } from "@/store/useSupplier";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { EditSupplierForm } from "../forms/EditSupplierForm";

export const SupplierActions = ({ supplier }: { supplier: ISupplier }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { openSheet, closeSheet } = useSheetStore();
  const { deleteSupplier } = useSupplierStore();
  const { openDialog, closeDialog } = useDialogStore();

  const handleEdit = () => {
    openSheet(
      "Editar proveedor",
      "Completá los campos para editar tu proveedor",
      <EditSupplierForm supplier={supplier} onSuccess={closeSheet} />
    );
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      setIsDeleting(true);
      try {
        await deleteSupplier(supplier._id);
        closeDialog();
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
      } finally {
        setIsDeleting(false);
      }
    };

    openDialog({
      title: "Eliminar proveedor",
      description: `¿Estás seguro de que querés eliminar el proveedor "${supplier.name}"? Esta acción no se puede deshacer.`,
      content: (
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
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
        asChild
        className="h-8 w-8 p-0"
      >
        <Link to={`/admin/proveedores/${supplier._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
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
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
