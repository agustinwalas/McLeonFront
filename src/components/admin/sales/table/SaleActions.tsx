// src/components/admin/sales/table/SaleActions.tsx
import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ISalePopulated } from "@/types/sale";
import useSalesStore from "@/store/useSales";
import { useDialogStore } from "@/store/useDialog";
import { toast } from "sonner";

interface SaleActionsProps {
  sale: ISalePopulated;
}

export function SaleActions({ sale }: SaleActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteSale } = useSalesStore();
  const { openDialog, closeDialog } = useDialogStore();

  const handleDelete = () => {
    const confirmDelete = async () => {
      setIsDeleting(true);
      try {
        await deleteSale(sale._id!);
        toast.success("Venta eliminada correctamente");
        closeDialog();
      } catch {
        toast.error("Error al eliminar la venta");
      } finally {
        setIsDeleting(false);
      }
    };

    openDialog({
      title: "Eliminar venta",
      description: `¿Estás seguro de que quieres eliminar la venta ${sale.saleNumber}?`,
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
        <Link to={`/admin/ventas/${sale._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="h-8 w-8 p-0"
      >
        <Link to={`/admin/ventas/${sale._id}/editar`}>
          <Edit className="h-4 w-4" />
        </Link>
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
}
