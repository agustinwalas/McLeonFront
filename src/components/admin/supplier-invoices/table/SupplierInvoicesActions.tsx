import { useSheetStore } from "@/store/useSheet";
import { ISupplierInvoice } from "@/types";
import { useDialogStore } from "@/store/useDialog";
import { useSupplierInvoiceStore } from "@/store/useSupplierInvoice";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditSupplierInvoiceForm } from "../forms/EditSupplierInvoiceForm";

export const SupplierInvoicesActions = ({
  invoice,
}: {
  invoice: ISupplierInvoice;
}) => {
  const { openSheet } = useSheetStore();
  const { deleteInvoice } = useSupplierInvoiceStore();
  const { openDialog, closeDialog } = useDialogStore();

  const handleEdit = () => {
    openSheet(
      "Editar factura",
      "Completá los campos para editar la factura del proveedor",
      <EditSupplierInvoiceForm invoice={invoice} onSuccess={closeDialog} />
    );
  };

  const handleDelete = () => {
    const confirmDelete = async () => {
      await deleteInvoice(invoice._id);
      closeDialog();
    };

    openDialog({
      title: "Eliminar factura",
      description: `¿Estás seguro de que querés eliminar la factura "${invoice.invoiceNumber}" de ${invoice.businessName}? Esta acción no se puede deshacer.`,
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
        title="Editar factura"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0"
        title="Eliminar factura"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
