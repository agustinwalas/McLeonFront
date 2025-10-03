import { NewSupplierInvoiceForm } from "@/components/admin/supplier-invoices/forms/NewSupplierInvoiceForm";
import { SuppliersInvoicesTable } from "@/components/admin/supplier-invoices/table/SuppliersInvoicesTable";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheet";

export const SuppliersInvoices = () => {
  const { openSheet, closeSheet } = useSheetStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Facturas Proveedores</h1>
        <div className="flex gap-2">
          <Button
            className="btn btn-primary"
            onClick={() =>
              openSheet(
                "Agregar Proveedor",
                "Completá los campos para crear un nuevo proveedor",
                <NewSupplierInvoiceForm onSuccess={closeSheet} />
              )
            }
          >
            Agregar
          </Button>
        </div>
      </div>
      <SuppliersInvoicesTable />
    </>
  );
};
